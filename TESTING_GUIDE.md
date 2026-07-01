# Getting Started with Tests

## Quick Start

### 1. Install Dependencies
```bash
npm install
```

This will install Jest and related testing dependencies defined in `package.json`.

### 2. Run All Tests
```bash
npm test
```

### 3. Run Tests with Coverage Report
```bash
npm run test:cov
```

## Test Files Created

The following test files have been created covering all major modules:

### Core Application
- `src/app.service.spec.ts` - Application service tests
- `src/app.controller.spec.ts` - Application controller tests

### Files Module
- `src/modules/files/files.service.spec.ts` - File service unit tests
- `src/modules/files/files.controller.spec.ts` - File controller integration tests

### Screens Module
- `src/modules/screens/screens.service.spec.ts` - Screen service unit tests
- `src/modules/screens/screens.controller.spec.ts` - Screen controller integration tests

### Playlists Module
- `src/modules/playlists/playlists.service.spec.ts` - Playlist service unit tests
- `src/modules/playlists/playlists.controller.spec.ts` - Playlist controller integration tests

### Sync Module
- `src/modules/sync/sync.service.spec.ts` - Sync service unit tests
- `src/modules/sync/sync.controller.spec.ts` - Sync controller integration tests

## Test Coverage Summary

| Module | Service Tests | Controller Tests | Total Test Cases |
|--------|---------------|------------------|------------------|
| App | ✅ | ✅ | 3 |
| Files | ✅ | ✅ | 23 |
| Screens | ✅ | ✅ | 22 |
| Playlists | ✅ | ✅ | 27 |
| Sync | ✅ | ✅ | 28 |
| **Total** | **5** | **4** | **~100+** |

## What's Being Tested

### Services
Each service has comprehensive unit tests covering:
- ✅ CRUD operations
- ✅ Business logic validation
- ✅ Error handling (NotFoundException, ConflictException, etc.)
- ✅ Edge cases
- ✅ Complex operations (manifest generation, state updates, etc.)

### Controllers
Each controller has integration tests covering:
- ✅ All HTTP endpoints (GET, POST, PUT, DELETE)
- ✅ Request parameter binding
- ✅ Response formatting
- ✅ Error propagation from services
- ✅ Header parsing and validation

## Mocking Strategy

All tests use Jest mocks for external dependencies:
- Repository methods are mocked
- Database calls return mock data
- Services are isolated from persistence layer

This allows fast, reliable unit tests that focus on business logic.

## Example: Running Specific Tests

### Run a single test file
```bash
npm test -- src/modules/files/files.service.spec.ts
```

### Run tests matching a pattern
```bash
npm test -- --testNamePattern="create"
```

### Run tests in watch mode
```bash
npm run test:watch
```

### Generate coverage report
```bash
npm run test:cov
```

The coverage report will be generated in the `coverage/` directory.

## Key Testing Areas

### Files Module
- Creating files with metadata
- Retrieving files by ID or MIME type
- Checking if files are used in playlists
- Updating file information
- Deleting files (with conflict detection)
- Filtering by type (videos vs images)

### Screens Module
- Creating screens with auto-generated API keys
- Retrieving screens and their playlists
- Assigning playlists to screens
- Updating assignments with time windows
- Generating new API keys
- Filtering screens by location

### Playlists Module
- Creating and updating playlists
- Adding items to playlists
- Removing items from playlists
- Reordering playlist items
- Tracking playlist revisions

### Sync Module
- Generating manifests for screens
- Caching manifests efficiently
- Detecting manifest changes
- Recording screen logs
- Managing fallback assets
- Updating screen state/playback position

## Troubleshooting

### Tests not found
Make sure Jest is installed:
```bash
npm install
```

### TypeScript errors
Ensure `tsconfig.json` is properly configured (already included in project).

### Mock issues
Each test file properly mocks repositories in the `beforeEach` hook.

## Next Steps

1. Run the tests: `npm test`
2. Check coverage: `npm run test:cov`
3. Review test output for any failures
4. Consider adding E2E tests for critical user flows
5. Add integration tests with real database connection

## Additional Resources

- See `TEST_SUITE_SUMMARY.md` for detailed test coverage breakdown
- Jest documentation: https://jestjs.io/
- NestJS Testing: https://docs.nestjs.com/fundamentals/testing
