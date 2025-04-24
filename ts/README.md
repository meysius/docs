```
mkdir project
cd project
npm init -y
npm install typescript ts-node @types/node --save-dev
npx tsc --init
mkdir src
touch src/main.ts
```

Copy this code in the main.ts:
```typescript
console.log("HELLO WORLD");
```

Then run:
```bash
npx ts-node src/main.ts
```