# Add a provider API key to your local FreeLLMAPI instance
param(
  [Parameter(Mandatory)][ValidateSet('groq','google','openrouter','mistral','cerebras','github','cloudflare','huggingface','ollama','custom')]
  [string]$Platform,
  [Parameter(Mandatory)][string]$ApiKey,
  [string]$Label = "ByteVerse",
  [string]$Base = "http://localhost:3001",
  [string]$Email = "admin@byteverse.local",
  [string]$Password = "byteverse123"
)

$login = Invoke-RestMethod -Uri "$Base/api/auth/login" -Method POST -ContentType "application/json" -Body (@{email=$Email;password=$Password} | ConvertTo-Json)
$headers = @{ Authorization = "Bearer $($login.token)" }

$body = @{ platform = $Platform; key = $ApiKey; label = $Label } | ConvertTo-Json
$result = Invoke-RestMethod -Uri "$Base/api/keys" -Method POST -Headers $headers -ContentType "application/json" -Body $body
Write-Host "Added $Platform (id=$($result.id), status=$($result.status))"
Write-Host "Health check runs automatically — refresh http://localhost:5173 Keys page."
