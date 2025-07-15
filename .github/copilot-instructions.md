# Copilot Custom Instructions

## Project context
This is a professional backend API project built with NestJS (TypeScript), PostgreSQL (Prisma), JWT authentication, OTP, email (SMTP/MailerSend), S3-compatible storage, and Docker.

## Coding style & patterns
- Use TypeScript best practices and NestJS module/controller/service patterns.
- Follow Clean Architecture, CQRS, and DDD principles.
- Use dependency injection, DTOs, value objects, and repository pattern.
- Use async/await, proper error handling, and never hardcode secrets.
- Use guards and decorators for authentication/authorization.
- Add JSDoc for exported functions/classes, OpenAPI decorators for endpoints.
- Comment complex logic, keep code clean and maintainable.
- Prefer explicit, descriptive variable and function names over abbreviations.
- Write code and comments as if explaining to a future teammate unfamiliar with the context.
- When in doubt, ask for clarification or provide options with pros/cons.
- Use clear, step-by-step commit messages and document architectural decisions in code or docs when relevant.

## Collaboration & AI Pair Programming
- When generating code, always consider the broader context and how changes affect maintainability, security, and testability.
- Suggest improvements or refactorings if you spot anti-patterns or code smells.
- If a requirement is ambiguous, highlight the ambiguity and suggest clarifying questions or safe defaults.
- Propose alternative approaches when appropriate, especially for complex or critical features.
- Reference relevant documentation or standards when making non-trivial design decisions.
- Use code comments to explain the reasoning behind non-obvious choices.

## Testing
- Use Jest for all tests (unit, integration, e2e).
- Mock external dependencies (db, email, storage).
- Use Arrange/Act/Assert structure in tests.
- Write tests that are easy to understand and maintain, with clear test names and separation of concerns.

## Security
- Never expose secrets or credentials in code or logs.
- Validate and sanitize all user input.
- Proactively flag potential security issues or risky patterns.

## Output
- Output only code unless documentation/explanation is requested.
- Use Markdown code blocks with language tags for all code snippets.
- When providing explanations, be concise and actionable, referencing official docs or project standards when possible.
