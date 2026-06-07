# FreeLLMAPI bootstrap for ByteVerse (Option A)
# Run after FreeLLMAPI is up on http://localhost:3001

$Base = "http://localhost:3001"
$Email = "admin@byteverse.local"
$Password = "byteverse123"

Write-Host "Setting up FreeLLMAPI dashboard account..."
try {
  $setup = Invoke-RestMethod -Uri "$Base/api/auth/setup" -Method POST -ContentType "application/json" -Body (@{email=$Email;password=$Password} | ConvertTo-Json)
  $token = $setup.token
} catch {
  $login = Invoke-RestMethod -Uri "$Base/api/auth/login" -Method POST -ContentType "application/json" -Body (@{email=$Email;password=$Password} | ConvertTo-Json)
  $token = $login.token
}

$headers = @{ Authorization = "Bearer $token" }

foreach ($platform in @("kilo", "llm7", "pollinations")) {
  try {
    $payload = @{ platform = $platform; label = "ByteVerse" }
    if ($platform -ne "kilo") { $payload.key = "anonymous" }
    Invoke-RestMethod -Uri "$Base/api/keys" -Method POST -Headers $headers -ContentType "application/json" -Body ($payload | ConvertTo-Json) | Out-Null
    Write-Host "Added provider: $platform"
  } catch {
    Write-Host "Skipped $platform (may already exist)"
  }
}

Write-Host ""
Write-Host "Optional — add Groq or Google for higher quality (requires YOUR free API key):"
Write-Host "  Groq:   https://console.groq.com/keys"
Write-Host "  Google: https://aistudio.google.com/apikey"
Write-Host "Then run: .\scripts\add-freellmapi-key.ps1 -Platform groq -ApiKey gsk_..."
