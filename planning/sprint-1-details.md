# Sprint 1: Architecture Design & UI/UX Foundation
**Duration**: 2 weeks (January 15 - January 26, 2024)  
**Team**: Noël Sigmunczyk, Ivan Malakhov, Alan Saji  
**Sprint Goal**: Establish solid technical foundation and design system

## Sprint Planning

### Initial Sprint Backlog
**Total Story Points**: 49  
**Team Velocity**: 25 points per sprint (estimated)  
**Sprint Capacity**: 50 points

### Task Breakdown

#### S1-001: System Architecture Design
**Assignee**: Noël Sigmunczyk  
**Story Points**: 8  
**Priority**: High  
**Status**: ✅ COMPLETED

**Description**: Design microservices architecture with API gateway pattern for the StockMarket application.

**Acceptance Criteria**:
- [x] Define service boundaries (Auth, Portfolio, Trading, Market Data)
- [x] Design API gateway routing and load balancing strategy
- [x] Create service communication patterns (REST, WebSocket)
- [x] Document data flow between services
- [x] Define deployment architecture (Docker containers)

**Technical Decisions**:
- Chose Axum framework for backend services
- Implemented JWT-based authentication
- Used WebSocket for real-time data updates
- Selected PostgreSQL for persistent data storage

**Deliverables**:
- Architecture diagram (draw.io)
- Service API specifications
- Deployment configuration files

---

#### S1-002: Database Schema Design
**Assignee**: Noël Sigmunczyk  
**Story Points**: 5  
**Priority**: High  
**Status**: ✅ COMPLETED

**Description**: Design normalized database schema for users, portfolios, and transactions.

**Acceptance Criteria**:
- [x] Design user table with authentication fields
- [x] Create portfolio and position tables
- [x] Design transaction history table
- [x] Define foreign key relationships
- [x] Create database migration scripts

**Technical Decisions**:
- Used UUID for primary keys
- Implemented soft deletes for audit trail
- Added indexes for performance optimization

**Deliverables**:
- Database schema diagram
- Migration scripts (SQL)
- Entity relationship diagram

---

#### S1-003: API Specification
**Assignee**: Noël Sigmunczyk  
**Story Points**: 5  
**Priority**: High  
**Status**: ✅ COMPLETED

**Description**: Create comprehensive OpenAPI/Swagger documentation for all endpoints.

**Acceptance Criteria**:
- [x] Document authentication endpoints
- [x] Define portfolio management APIs
- [x] Specify trading endpoints
- [x] Document error responses
- [x] Include request/response examples

**Deliverables**:
- OpenAPI 3.0 specification file
- Postman collection for testing
- API documentation website

---

#### S1-004: Authentication System Design
**Assignee**: Noël Sigmunczyk  
**Story Points**: 8  
**Priority**: High  
**Status**: ✅ COMPLETED

**Description**: Design JWT-based authentication flow with secure token management.

**Acceptance Criteria**:
- [x] Design JWT token structure
- [x] Implement token refresh mechanism
- [x] Define security headers and CORS
- [x] Create authentication middleware
- [x] Design password hashing strategy

**Technical Decisions**:
- Used bcrypt for password hashing
- Implemented refresh token rotation
- Added rate limiting for auth endpoints

**Deliverables**:
- Authentication flow diagram
- Security implementation guide
- Token management documentation

---

#### S1-005: Web UI Framework Setup
**Assignee**: Ivan Malakhov  
**Story Points**: 5  
**Priority**: Medium  
**Status**: ✅ COMPLETED

**Description**: Set up TypeScript, Vite, Bootstrap foundation for web application.

**Acceptance Criteria**:
- [x] Configure TypeScript with strict settings
- [x] Set up Vite build system
- [x] Integrate Bootstrap 5 framework
- [x] Configure SASS preprocessing
- [x] Set up development environment

**Technical Decisions**:
- Used Vite for fast development builds
- Implemented Bootstrap 5 with custom theme
- Added TypeScript strict mode

**Deliverables**:
- Configured web project structure
- Development environment setup guide
- Build configuration files

---

#### S1-006: Mobile UI Framework Setup
**Assignee**: Alan Saji  
**Story Points**: 5  
**Priority**: Medium  
**Status**: ✅ COMPLETED

**Description**: Set up Flutter with Riverpod state management for mobile application.

**Acceptance Criteria**:
- [x] Configure Flutter project structure
- [x] Set up Riverpod for state management
- [x] Configure GoRouter for navigation
- [x] Set up development environment
- [x] Configure build targets (iOS/Android)

**Technical Decisions**:
- Used Riverpod for reactive state management
- Implemented GoRouter for navigation
- Added fl_chart for data visualization

**Deliverables**:
- Configured mobile project structure
- State management setup guide
- Navigation configuration

---

#### S1-007: Design System Creation
**Assignee**: All Team Members  
**Story Points**: 8  
**Priority**: Medium  
**Status**: 🔄 IN PROGRESS (Carryover to Sprint 2)

**Description**: Create consistent design system across web and mobile platforms.

**Acceptance Criteria**:
- [x] Define color palette and typography
- [ ] Create component library
- [ ] Design responsive layouts
- [ ] Implement accessibility guidelines
- [ ] Create design tokens

**Issues Encountered**:
- **🔴 ISSUE**: Team members had conflicting design preferences
- **🔴 ISSUE**: Mobile and web design requirements differed significantly
- **🔴 ISSUE**: Accessibility guidelines needed more research

**Deliverables**:
- Color palette and typography guide
- Component design specifications
- Accessibility guidelines document

---

#### S1-008: CI/CD Pipeline Setup
**Assignee**: All Team Members  
**Story Points**: 5  
**Priority**: Low  
**Status**: ❌ NOT STARTED (Carryover to Sprint 2)

**Description**: Configure automated testing and deployment pipeline.

**Acceptance Criteria**:
- [ ] Set up GitHub Actions workflows
- [ ] Configure automated testing
- [ ] Set up deployment environments
- [ ] Implement code quality checks
- [ ] Configure monitoring and logging

**Issues Encountered**:
- **🔴 ISSUE**: Team lacked DevOps experience
- **🔴 ISSUE**: Deployment infrastructure not ready
- **🔴 ISSUE**: Testing strategy needed refinement

**Deliverables**:
- CI/CD pipeline configuration
- Deployment automation scripts
- Monitoring setup guide

---

## Sprint Review

### Completed Tasks
- ✅ System Architecture Design (8 points)
- ✅ Database Schema Design (5 points)
- ✅ API Specification (5 points)
- ✅ Authentication System Design (8 points)
- ✅ Web UI Framework Setup (5 points)
- ✅ Mobile UI Framework Setup (5 points)

**Completed Story Points**: 36/49 (73% completion)

### Carryover Tasks to Sprint 2
1. **S1-007: Design System Creation** (8 points) - In Progress
2. **S1-008: CI/CD Pipeline Setup** (5 points) - Not Started

**Carryover Story Points**: 13 points

### Sprint Retrospective

#### What Went Well
- Strong technical foundation established
- Clear architecture decisions made
- Good collaboration between team members
- Backend and frontend frameworks properly configured

#### Issues Identified
- **🔴 Design system conflicts between team members**
- **🔴 Lack of DevOps expertise in the team**
- **🔴 Insufficient time for comprehensive design system**
- **🔴 CI/CD setup requires more planning**

#### Action Items for Sprint 2
1. Schedule design system workshop to resolve conflicts
2. Research DevOps best practices for small teams
3. Allocate more time for design system completion
4. Consider external consultation for CI/CD setup

### Velocity Analysis
- **Planned Velocity**: 25 points
- **Actual Velocity**: 36 points (144% of planned)
- **Sprint 2 Capacity**: 37 points (25 + 12 carryover)

### Risk Assessment
- **Low Risk**: Architecture and framework setup
- **Medium Risk**: Design system completion
- **High Risk**: CI/CD pipeline implementation

### Next Sprint Preparation
- Prioritize design system completion
- Research CI/CD tools suitable for small teams
- Prepare for increased complexity in Sprint 2
- Schedule technical debt review session 