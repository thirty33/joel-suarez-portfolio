# Plan de Infraestructura AWS — joel-suarez-portfolio

Basado en la distribución **pedidosdelicius.cl** (`E32X8SZU0HMX9X`) que maneja 2 S3 buckets con una sola distribución CloudFront.

> **Sin dominio por ahora.** El sitio se accede vía la URL de CloudFront (`dXXXXXXXXX.cloudfront.net`).

---

## 1. Arquitectura AWS

```
Usuario → CloudFront (CDN + HTTPS)
              ├── / (default)           → S3 Site Bucket    (proyecto compilado)
              └── /assets/*             → S3 Assets Bucket  (solo vía signed URLs)
```

| Servicio | Propósito |
|---|---|
| **S3 (site)** | Bucket para el sitio estático (`dist/`) — acceso solo vía CloudFront OAC |
| **S3 (assets)** | Bucket para assets (imágenes, fuentes, SVGs) — acceso solo vía signed URLs |
| **CloudFront** | CDN con HTTPS, 2 origins, URL rewrite function, HTTP/2+3 |
| **CloudFront OAC** | Origin Access Control (sigv4) — acceso seguro de CloudFront a ambos buckets |
| **CloudFront Key Group** | Par de llaves para firmar URLs de assets |
| **CloudFront Functions** | Rewrite: `/ruta/` → `/ruta/index.html` |
| **Response Headers Policy** | `cache-control: public, max-age=63072000` (2 años) para assets |
| **IAM User** | Usuario de deploy con permisos mínimos sobre ambos buckets + CloudFront + CloudFormation |

---

## 2. Referencia: Configuración actual de pedidosdelicius.cl

### Distribución `E32X8SZU0HMX9X`

**2 origins:**
- `frontis-dev-app` (site) — OAC `E12KGQJ104LQVB`, default behavior
- `deli-soft-public` (assets) — OAC `E12KGQJ104LQVB`, 3 cache behaviors con path patterns

**Cache behaviors para assets:**

| Path Pattern | TrustedKeyGroups | ViewerProtocol | ResponseHeadersPolicy |
|---|---|---|---|
| `public-assets/*` | `assets-keys-group` (signed URLs) | https-only | `Cache-Control: 2 años` |
| `product-images/*` | `assets-keys-group` (signed URLs) | allow-all | `Cache-Control: 2 años` |
| `pdfs/*` | ninguno (acceso público) | https-only | `Cache-Control: 2 años` |

**Key Group:** `assets-keys-group` (`ad1b24e4-72e3-43fe-b033-e47f9acec579`)
- Public Key: `KQGAD8YX979YO` (`assets-key`)

**Bucket policy de assets (`deli-soft-public`):**
1. `DenyDirectPublicAccess` — Deny `*` a `s3:GetObject` salvo CloudFront o el IAM user
2. `AllowCloudFrontServicePrincipal` — Allow `cloudfront.amazonaws.com` desde la distribución específica
3. `AllowIAMUserAccess` — Allow IAM user `delicius-dev` CRUD completo (List, Get, Put, Delete)

**Bucket policy del sitio (`frontis-dev-app`):**
1. `AllowCloudFrontServicePrincipal` — Allow `cloudfront.amazonaws.com` desde la distribución

---

## 3. CloudFormation Template

Crear en `infrastructure/cloudformation.yml`.

### Parámetros:

| Parámetro | Tipo | Descripción |
|---|---|---|
| `SiteBucketName` | String | Nombre del bucket del sitio (ej: `joel-portfolio-site`) |
| `AssetsBucketName` | String | Nombre del bucket de assets (ej: `joel-portfolio-assets`) |
| `Environment` | String | `dev`, `staging`, o `prod` |
| `DeployUserName` | String | Nombre del usuario IAM de deploy |

### Recursos:

| Recurso | Tipo AWS | Notas |
|---|---|---|
| **Site Bucket** | | |
| `SiteBucket` | `S3::Bucket` | SSE-AES256. DeletionPolicy: Retain |
| `SiteBucketPolicy` | `S3::BucketPolicy` | Allow CloudFront OAC + Allow IAM user (sync deploy) |
| **Assets Bucket** | | |
| `AssetsBucket` | `S3::Bucket` | SSE-AES256. DeletionPolicy: Retain |
| `AssetsBucketPolicy` | `S3::BucketPolicy` | 3 statements: Deny acceso directo, Allow CloudFront OAC, Allow IAM user CRUD |
| **CloudFront** | | |
| `CloudFrontOAC` | `CloudFront::OriginAccessControl` | sigv4, always, S3. DeletionPolicy: Retain |
| `URLRewriteFunction` | `CloudFront::Function` | Runtime `cloudfront-js-2.0` — rewrite a `index.html` |
| `AssetsCachePolicy` | `CloudFront::ResponseHeadersPolicy` | `cache-control: public, max-age=63072000` |
| `CloudFrontDistribution` | `CloudFront::Distribution` | 2 origins, sin Aliases, certificado default de CloudFront, HTTP/2+3, IPv6 |
| **Signed URLs** | | |
| `AssetsPublicKey` | `CloudFront::PublicKey` | Clave pública para verificar firmas |
| `AssetsKeyGroup` | `CloudFront::KeyGroup` | Key group que referencia la public key |
| **IAM** | | |
| `DeployUser` | `IAM::User` | Usuario IAM de deploy |
| `DeployUserPolicy` | `IAM::ManagedPolicy` | Permisos sobre S3 + CloudFront + CloudFormation |
| `DeployUserAccessKey` | `IAM::AccessKey` | Access key para CI/CD |

### Default Behavior (site):

```yaml
TargetOriginId: SiteBucketOrigin
ViewerProtocolPolicy: redirect-to-https
CachePolicyId: 658327ea-f89d-4fab-a63d-7e88639e58f6  # Managed-CachingOptimized
FunctionAssociations:
  - EventType: viewer-request
    FunctionARN: !GetAtt URLRewriteFunction.FunctionARN
```

### Cache Behavior — Assets (`assets/*`):

```yaml
PathPattern: "assets/*"
TargetOriginId: AssetsBucketOrigin
ViewerProtocolPolicy: https-only
CachePolicyId: 658327ea-f89d-4fab-a63d-7e88639e58f6
TrustedKeyGroups:
  - !Ref AssetsKeyGroup
ResponseHeadersPolicyId: !Ref AssetsCachePolicy
```

### Custom Error Responses:

```yaml
- ErrorCode: 403 → /index.html (200)
- ErrorCode: 404 → /index.html (200)
```

### ViewerCertificate (sin dominio):

```yaml
ViewerCertificate:
  CloudFrontDefaultCertificate: true
```

### Outputs:

| Output | Export |
|---|---|
| `SiteBucketName` | `${StackName}-SiteBucketName` |
| `AssetsBucketName` | `${StackName}-AssetsBucketName` |
| `DistributionId` | `${StackName}-DistributionId` |
| `DistributionURL` | `https://${Distribution.DomainName}` |
| `DeployUserAccessKeyId` | — |
| `DeployUserSecretAccessKey` | — (NoEcho o en Secrets Manager) |

---

## 4. GitHub Actions Workflow

### Job 1: `infrastructure` (condicional)

Solo corre si `infrastructure/cloudformation.yml` cambió o es `workflow_dispatch`:

1. Configura credenciales AWS (del IAM user creado en el stack)
2. Verifica estado del stack CloudFormation
3. Si no existe: `create-stack`
4. Si existe: `update-stack` con `UsePreviousValue=true`

### Job 2: `build`

1. Checkout + Node 20 + `npm ci`
2. Genera `.env` desde GitHub Secrets
3. `npm run build`
4. Sube `dist/` como artifact (retención: 1 día)

### Job 3: `deploy` (depende de `infrastructure` + `build`)

1. Descarga artifact `dist/`
2. `aws s3 sync dist/ s3://$SITE_BUCKET --delete`
3. `aws cloudfront create-invalidation --distribution-id $DIST_ID --paths "/*"`

---

## 5. GitHub Secrets Mínimos

### AWS Credentials

| Secret | Descripción |
|---|---|
| `AWS_ACCESS_KEY_ID` | Access key del IAM user de deploy |
| `AWS_SECRET_ACCESS_KEY` | Secret key del IAM user de deploy |
| `AWS_REGION` | `us-east-1` |

### AWS Infraestructura

| Secret | Descripción | Ejemplo |
|---|---|---|
| `AWS_S3_SITE_BUCKET_NAME` | Bucket del sitio | `joel-portfolio-site` |
| `AWS_S3_ASSETS_BUCKET_NAME` | Bucket de assets | `joel-portfolio-assets` |
| `AWS_CLOUDFRONT_DISTRIBUTION_ID` | ID de la distribución | `E3XXXXXXXXXX` |
| `AWS_ENVIRONMENT` | Entorno | `prod` |

### Aplicación (mínimos para build)

| Secret | Descripción |
|---|---|
| `PUBLIC_SITE_NAME` | Nombre del sitio |
| `PUBLIC_SITE_TITLE` | Título (meta title) |
| `PUBLIC_CONTACT_EMAIL` | Email de contacto |
| `PUBLIC_WEBSITE_URL` | URL de CloudFront (se actualiza post-deploy) |

---

## 6. IAM User — Permisos (en CloudFormation)

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "S3SiteBucket",
      "Effect": "Allow",
      "Action": [
        "s3:PutObject", "s3:DeleteObject",
        "s3:ListBucket", "s3:GetObject"
      ],
      "Resource": [
        "arn:aws:s3:::SITE_BUCKET",
        "arn:aws:s3:::SITE_BUCKET/*"
      ]
    },
    {
      "Sid": "S3AssetsBucket",
      "Effect": "Allow",
      "Action": [
        "s3:PutObject", "s3:DeleteObject",
        "s3:ListBucket", "s3:GetObject"
      ],
      "Resource": [
        "arn:aws:s3:::ASSETS_BUCKET",
        "arn:aws:s3:::ASSETS_BUCKET/*"
      ]
    },
    {
      "Sid": "CloudFrontInvalidation",
      "Effect": "Allow",
      "Action": [
        "cloudfront:CreateInvalidation",
        "cloudfront:GetDistribution"
      ],
      "Resource": "arn:aws:cloudfront::ACCOUNT_ID:distribution/*"
    },
    {
      "Sid": "CloudFormationManagement",
      "Effect": "Allow",
      "Action": [
        "cloudformation:CreateStack",
        "cloudformation:UpdateStack",
        "cloudformation:DescribeStacks",
        "cloudformation:DescribeStackEvents",
        "cloudformation:CreateChangeSet",
        "cloudformation:DescribeChangeSet",
        "cloudformation:ExecuteChangeSet"
      ],
      "Resource": "arn:aws:cloudformation:us-east-1:ACCOUNT_ID:stack/joel-portfolio-*/*"
    }
  ]
}
```

> **Nota:** El deploy inicial del stack requiere un usuario con permisos más amplios (crear S3, CloudFront, IAM). Una vez creado el stack, el IAM user generado por CloudFormation se usa para deploys subsecuentes.

---

## 7. Signed URLs para Assets

Los assets en el bucket de assets solo son accesibles mediante URLs firmadas de CloudFront.

### Flujo:
1. Se genera un par de llaves RSA (pública/privada)
2. La **clave pública** se sube a CloudFront como `PublicKey` y se asocia a un `KeyGroup`
3. La **clave privada** se almacena de forma segura (Secrets Manager o local)
4. Para acceder a un asset, se genera una signed URL con la clave privada
5. CloudFront valida la firma con la clave pública del KeyGroup

### Generar par de llaves (una sola vez):
```bash
openssl genrsa -out private_key.pem 2048
openssl rsa -pubout -in private_key.pem -out public_key.pem
```

> **Importante:** La clave privada NO se sube a CloudFormation. Se guarda en Secrets Manager o como GitHub Secret para generar URLs firmadas desde CI o un backend.

---

## 8. Variables de Entorno Locales (`.env`)

```env
# --- Sitio ---
PUBLIC_SITE_NAME="Joel Suarez Portfolio"
PUBLIC_SITE_TITLE="Joel Suarez — Software Engineer"
PUBLIC_CONTACT_EMAIL="tu@email.com"
PUBLIC_WEBSITE_URL=""

# --- AWS (referencia local) ---
AWS_S3_SITE_BUCKET_NAME="joel-portfolio-site"
AWS_S3_ASSETS_BUCKET_NAME="joel-portfolio-assets"
AWS_CLOUDFRONT_DISTRIBUTION_ID=""
AWS_ENVIRONMENT="dev"
```

---

## 9. Subir Secrets con gh CLI

```bash
# AWS credentials
gh secret set AWS_ACCESS_KEY_ID --body "AKIA..."
gh secret set AWS_SECRET_ACCESS_KEY --body "..."
gh secret set AWS_REGION --body "us-east-1"

# Infraestructura
gh secret set AWS_S3_SITE_BUCKET_NAME --body "joel-portfolio-site"
gh secret set AWS_S3_ASSETS_BUCKET_NAME --body "joel-portfolio-assets"
gh secret set AWS_CLOUDFRONT_DISTRIBUTION_ID --body "E3..."
gh secret set AWS_ENVIRONMENT --body "prod"

# App
gh secret set PUBLIC_SITE_NAME --body "Joel Suarez Portfolio"
gh secret set PUBLIC_SITE_TITLE --body "Joel Suarez — Software Engineer"
gh secret set PUBLIC_CONTACT_EMAIL --body "tu@email.com"
gh secret set PUBLIC_WEBSITE_URL --body "https://dXXXXXXXXX.cloudfront.net"
```

---

## 10. Orden de Ejecución

1. Generar par de llaves RSA para signed URLs (`openssl genrsa` / `openssl rsa -pubout`)
2. Crear `infrastructure/cloudformation.yml` con todos los recursos (sección 3)
3. Deploy inicial del stack con un usuario IAM con permisos amplios (o root)
4. Obtener outputs del stack: Distribution ID, bucket names, access keys del IAM user creado
5. Subir secrets al repositorio de GitHub (sección 9) usando los outputs del paso 4
6. Crear `.github/workflows/deploy.yml` (sección 4)
7. Push a `main` → el workflow despliega automáticamente
8. Acceder al sitio vía `https://dXXXXXXXXX.cloudfront.net`

> Cuando se quiera agregar dominio, se añade al stack: ACM Certificate + Route53 Records + Aliases en la distribución.

---

## 11. Archivos a Crear

| Archivo | Descripción |
|---|---|
| `infrastructure/cloudformation.yml` | Template CloudFormation (2 buckets, CloudFront, IAM, Key Group) |
| `.github/workflows/deploy.yml` | Workflow de CI/CD |
| `.env` | Variables locales (no se commitea) |
| `.env.example` | Plantilla de referencia (se commitea) |

> El `.gitignore` ya incluye `.env`. Verificar que también ignore `dist/` y `node_modules/`.
