# Point iPhone Price Calculator

A pricing calculator for iPhone sales with integrated WhatsApp message builder.

## Setup

### Prerequisites

- Node.js 18+ (recommended: 22.x)
- npm 9+

### Installation

```bash
# Clone the repository
git clone https://github.com/Nicokevo/Point-iPhone-Price-Calculator.git
cd Point-iPhone-Price-Calculator

# Install dependencies
npm install

# Start development server
npm run dev
```

## Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run test` | Run tests once |
| `npm run test:watch` | Run tests in watch mode |
| `npm run lint` | Run ESLint |
| `npm run preview` | Preview production build |

## Updating Pricing

Pricing data should be managed through environment variables or a dedicated configuration file.

**To update prices safely:**

1. Create or update the pricing configuration in the designated config file
2. Run the test suite to ensure calculations are correct: `npm run test`
3. Build the project to verify no errors: `npm run build`
4. Commit changes with a descriptive message

## Security

> **WARNING: No secrets in repository**
>
> - Never commit `.env` files with real credentials
> - Never commit API keys, tokens, or passwords
> - Use `.env.example` as a template for required variables
> - See [SECURITY.md](./SECURITY.md) for vulnerability reporting

## Tech Stack

- React 19
- TypeScript
- Vite
- Tailwind CSS
- Vitest (testing)

## License

Private repository - All rights reserved.
