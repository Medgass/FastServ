$filePath = "c:\Users\Dell\Desktop\mes projet\FastServ\src\components\data\versaillesCafeMenu.json"

# Read with UTF8 encoding
$content = [System.IO.File]::ReadAllText($filePath, [System.Text.Encoding]::UTF8)

# Fix all encoding issues
$replacements = @{
    'Versailles Café©' = 'Versailles Café'
    'CHOCOLAT GLACÃ‰Æ'Ã¢â‚¬Â°' = 'CHOCOLAT GLACÉ'
    'YAOURT GLACÃ‰Æ'Ã¢â‚¬Â°' = 'YAOURT GLACÉ'
    'CRÃƒÆ'Ã…Â PE' = 'CRÊPE'
    'CRÃŠPE' = 'CRÊPE'
    'AMÃƒÆ'Ã¢â‚¬Â°RICAIN' = 'AMÉRICAIN'
    'CRÃƒÆ'Ã‹â€ ME' = 'CRÈME'
    'CAFÃƒÆ'Ã¢â‚¬Â° AU LAIT' = 'CAFÉ AU LAIT'
    'NESCAFÃƒÆ'Ã¢â‚¬Â°' = 'NESCAFÉ'
    'MINÃƒÆ'Ã¢â‚¬Â°RALE' = 'MINÉRALE'
    'GLAÃƒÆ'Ã¢â‚¬Â¡ON' = 'GLAÇON'
    'THÉƒâ€°' = 'THÉ'
    'GoÃƒÆ'Ã‚Â»t' = 'Goût'
    'SALÃƒÆ'Ã¢â‚¬Â°E' = 'SALÉE'
    'SALÃƒâ€°S' = 'SALÉS'
    'CafÃƒÆ'Ã‚Â©' = 'Café'
    'crÃƒÆ'Ã‚Âªpe' = 'crêpe'
    'crÃƒÆ'Ã‚Â¨me' = 'crème'
    'CrÃƒÆ'Ã‚Âªpe' = 'Crêpe'
}

foreach ($pair in $replacements.GetEnumerator()) {
    $content = $content -replace [regex]::Escape($pair.Key), $pair.Value
}

# Write with UTF8 encoding (no BOM)
[System.IO.File]::WriteAllText($filePath, $content, [System.Text.UTF8Encoding]::new($false))

Write-Host "Encoding fixed successfully!"
