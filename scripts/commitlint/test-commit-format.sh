#!/bin/bash

echo "🧪 Test de la configuration commitlint"
echo "========================================"
echo ""

# Tests qui doivent échouer
echo "❌ Tests qui doivent ÉCHOUER :"
echo ""

echo "1. Message sans gitmoji ni type :"
echo "test message" | pnpx commitlint
echo ""

echo "2. Message conventionnel sans gitmoji :"
echo "feat(auth): add oauth2 integration" | pnpx commitlint
echo ""

echo "3. Gitmoji sans type :"
echo "✨ add oauth2 integration" | pnpx commitlint
echo ""

echo "4. Message trop court :"
echo "✨ feat: test" | pnpx commitlint
echo ""

# Tests qui doivent réussir
echo "✅ Tests qui doivent RÉUSSIR :"
echo ""

echo "1. Message avec code gitmoji :"
echo ":sparkles: feat(auth): add oauth2 integration" | pnpx commitlint
if [ $? -eq 0 ]; then
    echo "   ✅ SUCCÈS"
else
    echo "   ❌ ÉCHEC"
fi
echo ""

echo "2. Message avec emoji réel :"
echo "✨ feat(auth): add oauth2 integration" | pnpx commitlint
if [ $? -eq 0 ]; then
    echo "   ✅ SUCCÈS"
else
    echo "   ❌ ÉCHEC"
fi
echo ""

echo "3. Message de fix avec code :"
echo ":bug: fix(partners): resolve pagination issue" | pnpx commitlint
if [ $? -eq 0 ]; then
    echo "   ✅ SUCCÈS"
else
    echo "   ❌ ÉCHEC"
fi
echo ""

echo "4. Message de documentation :"
echo ":memo: docs(readme): update installation guide" | pnpx commitlint
if [ $? -eq 0 ]; then
    echo "   ✅ SUCCÈS"
else
    echo "   ❌ ÉCHEC"
fi
echo ""

echo "5. Votre message d'origine :"
echo ":wrench: chore: improvement format commit with gitmoji+prefix+message" | pnpx commitlint
if [ $? -eq 0 ]; then
    echo "   ✅ SUCCÈS"
else
    echo "   ❌ ÉCHEC"
fi
echo ""

echo "🎉 Tests terminés !"
