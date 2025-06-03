
import { supabase } from '@/integrations/supabase/client';

export const seedOpenRewriteData = async () => {
  const REPOSITORY_ID = 'cbb24b3f-1590-40fa-91e5-b0ba660d2a6b';

  try {
    // Create function analyses first
    const functionAnalyses = [
      {
        repository_id: REPOSITORY_ID,
        file_path: 'rewrite-core/src/main/java/org/openrewrite/Recipe.java',
        function_name: 'Recipe',
        function_signature: 'public abstract class Recipe',
        description: 'Base class for all code transformation recipes',
        complexity_level: 'complex',
        tags: ['core', 'transformation', 'ast']
      },
      {
        repository_id: REPOSITORY_ID,
        file_path: 'rewrite-java/src/main/java/org/openrewrite/java/JavaVisitor.java',
        function_name: 'JavaVisitor',
        function_signature: 'public class JavaVisitor<P> extends TreeVisitor<J, P>',
        description: 'Visitor pattern implementation for Java AST traversal',
        complexity_level: 'complex',
        tags: ['java', 'visitor', 'ast']
      },
      {
        repository_id: REPOSITORY_ID,
        file_path: 'rewrite-core/src/main/java/org/openrewrite/ExecutionContext.java',
        function_name: 'ExecutionContext',
        function_signature: 'public class ExecutionContext',
        description: 'Context object for recipe execution with metadata and configuration',
        complexity_level: 'moderate',
        tags: ['execution', 'context', 'configuration']
      }
    ];

    await supabase.from('function_analyses').insert(functionAnalyses);

    // Developer-focused Q&A
    const devQA = [
      {
        repository_id: REPOSITORY_ID,
        function_id: 'recipe-core',
        function_name: 'Recipe',
        question: 'How does OpenRewrite\'s visitor pattern work for AST traversal and transformation?',
        answer: `## OpenRewrite Visitor Pattern Architecture

The visitor pattern in OpenRewrite is a sophisticated implementation that enables **safe, type-aware AST transformations**:

### Core Components:

**1. TreeVisitor Base Class**
\`\`\`java
public abstract class TreeVisitor<T extends Tree, P> {
    public T visit(@Nullable Tree tree, P p) {
        // Polymorphic dispatch to specific visit methods
    }
}
\`\`\`

**2. Language-Specific Visitors**
- \`JavaVisitor<P>\` - Java language constructs
- \`YamlVisitor<P>\` - YAML file transformations  
- \`XmlVisitor<P>\` - XML document processing

### Traversal Mechanics:

**Pre-order Traversal**: Visitors traverse the AST in pre-order, allowing parent context to influence child transformations.

**Immutable Updates**: Each visit returns a new tree node, preserving original structure while building transformed result.

**Type Safety**: Generic type parameters ensure compile-time safety for visitor context and return types.

### Example Implementation:
\`\`\`java
public class RemoveUnusedImports extends JavaVisitor<ExecutionContext> {
    @Override
    public J.CompilationUnit visitCompilationUnit(J.CompilationUnit cu, ExecutionContext ctx) {
        // Analyze imports usage
        Set<String> usedTypes = findUsedTypes(cu);
        
        return cu.withImports(
            cu.getImports().stream()
                .filter(imp -> isImportUsed(imp, usedTypes))
                .collect(toList())
        );
    }
}
\`\`\`

This pattern enables **surgical precision** in code transformations while maintaining **complete formatting preservation**.`,
        question_type: 'developer',
        view_mode: 'dev',
        rating_score: 15
      },
      {
        repository_id: REPOSITORY_ID,
        function_id: 'recipe-core',
        function_name: 'Recipe',
        question: 'What\'s the difference between Recipe and RefactoringVisitor in OpenRewrite?',
        answer: `## Recipe vs RefactoringVisitor: Understanding OpenRewrite\'s Architecture

### Recipe (High-Level Orchestration)
**Purpose**: Defines *what* transformation to perform
**Scope**: Business logic and transformation strategy

\`\`\`java
public class UpgradeSpringBoot extends Recipe {
    @Override
    public String getDisplayName() {
        return "Upgrade Spring Boot 2.x to 3.x";
    }
    
    @Override
    protected List<Recipe> getRecipeList() {
        return Arrays.asList(
            new UpdateDependencies(),
            new MigrateSecurityConfig(),
            new UpdatePropertyNames()
        );
    }
}
\`\`\`

### RefactoringVisitor (Low-Level Implementation)
**Purpose**: Defines *how* to perform specific AST transformations
**Scope**: Technical implementation details

\`\`\`java
public class UpdateDependencies extends JavaRefactoringVisitor {
    @Override
    public J.MethodInvocation visitMethodInvocation(J.MethodInvocation method) {
        if (isDeprecatedSpringMethod(method)) {
            return method.withName(method.getName().withName("newMethodName"));
        }
        return super.visitMethodInvocation(method);
    }
}
\`\`\`

### Key Differences:

| Aspect | Recipe | RefactoringVisitor |
|--------|--------|-------------------|
| **Abstraction Level** | High-level transformation strategy | Low-level AST manipulation |
| **Composition** | Can combine multiple recipes/visitors | Implements specific transformation logic |
| **Reusability** | Highly reusable across projects | Specific to particular code patterns |
| **Testing** | Integration-style testing | Unit-testable transformation logic |
| **Metadata** | Rich description, tags, documentation | Focused on implementation details |

### Best Practices:
- **Use Recipes** for user-facing transformations
- **Use RefactoringVisitors** for the actual implementation
- **Compose complex transformations** by combining multiple recipes
- **Keep visitors focused** on single responsibility`,
        question_type: 'developer',
        view_mode: 'dev',
        rating_score: 12
      },
      {
        repository_id: REPOSITORY_ID,
        function_id: 'lst-core',
        function_name: 'LST',
        question: 'How does the LST (Lossless Semantic Tree) preserve formatting and comments?',
        answer: `## LST: Preserving Every Character of Your Code

The **Lossless Semantic Tree (LST)** is OpenRewrite's revolutionary approach to maintaining **100% formatting fidelity** during transformations.

### Core Principles:

**1. Complete Information Preservation**
- **Whitespace**: Every space, tab, newline is tracked
- **Comments**: Both block and line comments with exact positioning
- **Formatting**: Indentation, alignment, code style choices

**2. Separation of Concerns**
\`\`\`java
public class J.MethodDeclaration implements J {
    // Semantic information
    private final String name;
    private final List<J.Annotation> annotations;
    private final J.Block body;
    
    // Formatting information  
    private final Formatting formatting;
    private final List<Comment> comments;
}
\`\`\`

### Formatting Preservation Strategy:

**Before Transformation:**
\`\`\`java
public class Example {
    /* Important business logic comment */
    @Deprecated    // Legacy method
    public void oldMethod(  ) {
        // TODO: refactor this
        doSomething();
    }
}
\`\`\`

**After Transformation (method rename):**
\`\`\`java
public class Example {
    /* Important business logic comment */
    @Deprecated    // Legacy method  
    public void newMethod(  ) {
        // TODO: refactor this
        doSomething();
    }
}
\`\`\`

### Technical Implementation:

**Formatting Objects**: Each AST node carries formatting metadata
\`\`\`java
public class Formatting {
    private final String prefix;  // Whitespace before element
    private final String suffix;  // Whitespace after element
    private final List<Comment> comments;
}
\`\`\`

**Comment Preservation**: Comments are associated with the nearest meaningful AST node

**Whitespace Tracking**: Even irregular spacing is maintained exactly

### Business Value:
- **Zero diff noise** in code reviews
- **Preserves team coding standards** 
- **Maintains git blame history** accuracy
- **No reformatting disruption** to development workflow

This makes OpenRewrite transformations **invisible to code review** except for the actual logical changes.`,
        question_type: 'developer',
        view_mode: 'dev',
        rating_score: 18
      }
    ];

    await supabase.from('function_qa').insert(devQA);

    // Business-focused Q&A
    const businessQA = [
      {
        repository_id: REPOSITORY_ID,
        function_id: 'business-value',
        function_name: 'Business Impact',
        question: 'How does OpenRewrite reduce technical debt migration costs and what\'s the typical ROI?',
        answer: `## OpenRewrite: Transforming Technical Debt into Competitive Advantage

### Cost Reduction Analysis

**Traditional Manual Migration:**
- **Developer Time**: 6-18 months for major framework upgrades
- **Risk Factor**: High probability of introducing bugs
- **Opportunity Cost**: Features delayed, innovation stalled
- **Team Morale**: Repetitive, error-prone work burns out senior developers

**OpenRewrite Automated Migration:**
- **Execution Time**: Hours to days for the same scope
- **Consistency**: 100% pattern application across entire codebase
- **Risk Reduction**: Automated testing ensures transformation accuracy
- **Developer Focus**: Teams work on business value, not mechanical changes

### Real-World ROI Examples:

**Enterprise Spring Boot 2→3 Migration:**
- **Manual Estimate**: 8 developers × 4 months = 32 person-months
- **OpenRewrite**: 2 developers × 1 week = 0.5 person-months
- **Savings**: 31.5 person-months ≈ **$315,000** at $10k/month loaded cost
- **Risk Reduction**: Eliminated estimated 40+ integration bugs

**Legacy Java 8→17 Upgrade:**
- **Codebase**: 2.3M lines across 15 microservices
- **Timeline Acceleration**: 18 months → 3 weeks
- **Additional Benefits**: 
  - Security vulnerabilities closed immediately
  - Performance improvements realized 15 months earlier
  - Team availability for new feature development

### Strategic Business Impact:

**1. Competitive Velocity**
- Faster adoption of new frameworks and security patches
- Reduced time-to-market for features requiring modern dependencies

**2. Risk Mitigation** 
- Automated compliance with security standards
- Consistent application of best practices across teams

**3. Developer Retention**
- Senior developers focus on architecture and innovation
- Reduced frustration with repetitive refactoring tasks

**4. Technical Debt Paydown**
- Transform legacy code systematically rather than reactively
- Maintain modern, maintainable codebase continuously

### Typical ROI Calculation:
**Break-even**: First migration (usually 10-20x cost savings)
**Year 1 ROI**: 500-1000% including risk reduction and opportunity gains
**Long-term**: Continuous value through ongoing automated maintenance`,
        question_type: 'business',
        view_mode: 'business',
        rating_score: 22
      },
      {
        repository_id: REPOSITORY_ID,
        function_id: 'risk-management',
        function_name: 'Safety Mechanisms',
        question: 'How does OpenRewrite ensure code transformations are safe and prevent breaking changes?',
        answer: `## OpenRewrite Safety Framework: Trust Through Verification

### Multi-Layer Safety Architecture

**1. Static Analysis Foundation**
- **Type-Aware Transformations**: Full compilation context prevents type mismatches
- **Semantic Validation**: Understands code meaning, not just syntax patterns
- **Dependency Analysis**: Tracks method signatures, class hierarchies, and usage patterns

**2. Automated Testing Integration**
\`\`\`yaml
# Recipe validation pipeline
validation:
  - compile_check: "Code must compile before and after"
  - test_suite: "All existing tests must pass"
  - semantic_equivalence: "Behavior preservation verification"
\`\`\`

**3. Dry-Run Capabilities**
- **Preview Mode**: See all changes before applying them
- **Diff Generation**: Exact visualization of proposed modifications  
- **Impact Analysis**: Understand scope and risk of each transformation

### Enterprise Safety Measures:

**Change Validation Workflow:**
1. **Pre-flight Checks**: Verify repository state and dependencies
2. **Incremental Application**: Apply recipes in controlled batches
3. **Automated Rollback**: Instant reversion if validation fails
4. **Quality Gates**: Configurable success criteria for each phase

**Risk Assessment Metrics:**
- **Confidence Score**: AI-generated risk assessment per transformation
- **Blast Radius**: Analysis of how many files/components affected
- **Test Coverage**: Validation that changes are covered by existing tests

### Real-World Safety Examples:

**Spring Security Migration:**
\`\`\`
[SAFE] @EnableWebSecurity annotation update
   - Semantic equivalent, widely tested pattern
   - 10,000+ successful applications in community

[REVIEW] Custom authentication provider changes  
   - Business logic modification detected
   - Manual review recommended for security implications
\`\`\`

**JUnit 4→5 Migration:**
- **Automated**: 95% of test annotations and assertions
- **Flagged for Review**: Custom test extensions and runners
- **Preserved**: All test coverage and validation logic

### Business Confidence Measures:

**1. Community Validation**
- 50,000+ organizations using OpenRewrite in production
- Recipes tested across millions of codebases
- Open source transparency enables community review

**2. Gradual Adoption Strategy**
- Start with low-risk, high-value transformations
- Build confidence through successful smaller changes
- Scale to more complex transformations over time

**3. Enterprise Support Options**
- Professional services for complex custom transformations
- Training and best practices for internal teams
- Direct support channels for mission-critical applications

The result: **Enterprise-grade confidence** in automated code transformations with **measurable risk reduction** compared to manual changes.`,
        question_type: 'business',
        view_mode: 'business',
        rating_score: 19
      },
      {
        repository_id: REPOSITORY_ID,
        function_id: 'adoption',
        function_name: 'Team Integration',
        question: 'What\'s the learning curve and integration timeline for development teams adopting OpenRewrite?',
        answer: `## OpenRewrite Adoption: From Zero to Production in Weeks

### Learning Curve by Role

**For Developers (Individual Contributors):**
- **Week 1**: Running existing recipes, understanding basic concepts
- **Week 2-3**: Writing simple custom recipes for team-specific patterns  
- **Month 1+**: Advanced recipe composition and complex transformations

**For Tech Leads/Architects:**
- **Day 1**: Strategic understanding of transformation capabilities
- **Week 1**: Integration planning and toolchain setup
- **Week 2**: Custom recipe strategy and governance framework

**For Engineering Managers:**
- **Day 1**: ROI understanding and team impact assessment
- **Week 1**: Success metrics definition and rollout planning
- **Ongoing**: Measuring productivity gains and risk reduction

### Phased Integration Timeline:

**Phase 1: Foundation (Week 1-2)**
\`\`\`yaml
objectives:
  - Tool installation and basic CLI usage
  - Run community recipes on sample projects
  - Establish CI/CD integration patterns

deliverables:
  - OpenRewrite integrated into build pipeline
  - First successful transformation (e.g., dependency upgrade)
  - Team training completion
\`\`\`

**Phase 2: Customization (Week 3-6)**
\`\`\`yaml
objectives:
  - Develop team-specific transformation recipes
  - Establish code review processes for recipes
  - Create internal recipe library

deliverables:
  - 3-5 custom recipes addressing team pain points
  - Recipe testing and validation framework
  - Documentation and knowledge sharing
\`\`\`

**Phase 3: Scale (Month 2+)**
\`\`\`yaml
objectives:
  - Organization-wide recipe sharing
  - Advanced transformation strategies
  - Continuous improvement integration

deliverables:
  - Cross-team recipe collaboration platform
  - Automated technical debt reduction workflows
  - Measurable productivity improvements
\`\`\`

### Success Accelerators:

**1. Quick Wins Strategy**
- Start with universally beneficial recipes (dependency updates, security fixes)
- Target high-pain, low-risk transformations first
- Celebrate and communicate early successes

**2. Community Leverage**
- 300+ pre-built recipes available immediately
- Active community support and knowledge sharing
- Regular webinars and best practice sessions

**3. Training Resources**
- Comprehensive documentation with examples
- Interactive tutorials and workshops
- Dedicated customer success support

### Typical Team Adoption Metrics:

**Month 1:**
- 5-10 successful automated transformations
- 50-80% reduction in manual refactoring time
- High developer satisfaction with tool capabilities

**Month 3:**
- 20+ custom recipes addressing specific team needs
- Integration into standard development workflows
- Measurable impact on technical debt reduction

**Month 6:**
- Organization-wide transformation strategy
- Advanced recipe composition and sharing
- Strategic competitive advantage through rapid modernization

### Investment vs. Return:

**Initial Investment**: 1-2 weeks team training, 1 week integration
**Ongoing Effort**: 10-20% developer time for recipe maintenance
**Return**: 200-400% productivity gain on refactoring and modernization tasks

The key insight: **OpenRewrite adoption follows a hockey stick curve** - initial learning investment pays exponential dividends as teams master automated transformation capabilities.`,
        question_type: 'business',
        view_mode: 'business',
        rating_score: 16
      }
    ];

    await supabase.from('function_qa').insert(businessQA);

    // Architecture documentation
    const architectureDocs = [
      {
        repository_id: REPOSITORY_ID,
        section_type: 'overview',
        title: 'OpenRewrite System Architecture',
        content: `# OpenRewrite System Architecture

## High-Level Component Overview

OpenRewrite is built on a **modular, extensible architecture** that separates concerns between parsing, transformation, and execution:

\`\`\`
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Parser Layer  │───▶│ Transform Layer │───▶│ Execution Layer │
│                 │    │                 │    │                 │
│ • Language      │    │ • Recipe        │    │ • ExecutionCtx  │
│   Parsers       │    │   Engine        │    │ • Result        │
│ • LST Creation  │    │ • Visitor       │    │   Collection    │
│ • Type          │    │   Pattern       │    │ • Change        │
│   Resolution    │    │ • Refactoring   │    │   Application   │
└─────────────────┘    └─────────────────┘    └─────────────────┘
\`\`\`

## Core Architectural Principles

### 1. Language-Agnostic Foundation
- **Pluggable Parser Architecture**: Each language implements common interfaces
- **Unified AST Representation**: LST (Lossless Semantic Tree) for all languages
- **Cross-Language Transformations**: Recipes can work across multiple file types

### 2. Immutable Data Structures
- **Functional Transformation Model**: All changes create new tree nodes
- **Thread Safety**: Parallel recipe execution without coordination overhead
- **Rollback Capabilities**: Original structure always preserved

### 3. Type-Safe Visitor Pattern
- **Compile-Time Safety**: Generic type system prevents runtime errors
- **Extensible Traversal**: Custom visitors for specific transformation needs
- **Composable Behaviors**: Multiple visitors can be chained safely

## Component Deep Dive

### Parser Layer
**Responsibility**: Convert source code into searchable, transformable LST
- Language-specific parsing (Java, Kotlin, Groovy, XML, YAML, etc.)
- Type attribution and symbol resolution
- Formatting and comment preservation

### Transform Layer  
**Responsibility**: Define and execute code transformations
- Recipe composition and orchestration
- Visitor-based AST manipulation
- Pattern matching and replacement logic

### Execution Layer
**Responsibility**: Coordinate transformation application and result collection
- Parallel execution management
- Change validation and conflict resolution
- Result aggregation and reporting`,
        order_index: 1
      },
      {
        repository_id: REPOSITORY_ID,
        section_type: 'data_flow',
        title: 'Recipe Execution Pipeline',
        content: `# Recipe Execution Pipeline

## Transformation Workflow

The recipe execution pipeline orchestrates complex code transformations through a well-defined sequence:

\`\`\`
Source Code
     ↓
┌─────────────┐
│   Parse     │ ← Language-specific parsers
│             │   (Java, Kotlin, YAML, etc.)
└─────────────┘
     ↓
┌─────────────┐
│  Type       │ ← Symbol resolution & 
│  Attribution│   dependency analysis
└─────────────┘
     ↓
┌─────────────┐
│   Recipe    │ ← Visitor pattern application
│  Execution  │   with transformation logic  
└─────────────┘
     ↓
┌─────────────┐
│  Validation │ ← Compilation check &
│  & Testing  │   semantic verification
└─────────────┘
     ↓
┌─────────────┐
│   Result    │ ← Transformed source with
│ Collection  │   preserved formatting
└─────────────┘
\`\`\`

## Pipeline Stages Detail

### 1. Parsing & LST Construction
- **Input**: Raw source files and classpath dependencies
- **Process**: Language-aware parsing with full type information
- **Output**: LST with complete semantic model

### 2. Recipe Application
- **Input**: LST + Recipe definitions + ExecutionContext
- **Process**: Visitor traversal with transformation rules
- **Output**: Modified LST with change markers

### 3. Change Validation
- **Input**: Original LST + Modified LST
- **Process**: Semantic equivalence checking and compilation validation
- **Output**: Validated changes ready for application

### 4. Result Generation
- **Input**: Validated changes + Original formatting
- **Process**: LST serialization with formatting preservation
- **Output**: Transformed source code files

## Parallel Execution Model

OpenRewrite leverages **embarrassingly parallel** execution for performance:

\`\`\`
Recipe Engine
     ↓
┌─────────────┐   ┌─────────────┐   ┌─────────────┐
│   File 1    │   │   File 2    │   │   File N    │
│  Processing │   │  Processing │   │  Processing │
└─────────────┘   └─────────────┘   └─────────────┘
     ↓                   ↓                   ↓
┌─────────────────────────────────────────────────┐
│              Result Aggregation                │
└─────────────────────────────────────────────────┘
\`\`\`

**Benefits:**
- Linear scalability with CPU cores
- Independent file processing reduces complexity
- Fault isolation - one file failure doesn't block others`,
        order_index: 2
      }
    ];

    await supabase.from('architecture_docs').insert(architectureDocs);

    // Business explanations
    const businessExplanations = [
      {
        repository_id: REPOSITORY_ID,
        category: 'Technical Debt Strategy',
        question: 'How does automated refactoring transform technical debt management?',
        answer: `# Automated Technical Debt Management with OpenRewrite

## Strategic Transformation of Legacy Code

Traditional technical debt accumulates like compound interest - small shortcuts and outdated patterns compound into massive maintenance overhead. OpenRewrite transforms this reactive cycle into **proactive technical debt management**.

### The Technical Debt Cycle Breaker

**Traditional Approach:**
1. Debt accumulates silently
2. Crisis forces expensive manual fixes  
3. Team velocity degrades during "cleanup sprints"
4. Business pressure forces more shortcuts
5. Cycle repeats with increasing cost

**OpenRewrite Approach:**
1. Continuous automated debt identification
2. Systematic pattern-based remediation
3. Zero-disruption transformation during normal development
4. Proactive modernization prevents crisis scenarios
5. Sustainable development velocity maintained

### Business Impact Metrics

**Velocity Preservation:**
- Maintain 85%+ feature development capacity during migrations
- Eliminate dedicated "technical debt sprints"
- Reduce context switching between feature work and maintenance

**Risk Reduction:**
- Systematic security vulnerability patching
- Consistent application of compliance standards
- Reduced human error in repetitive transformations

**Cost Avoidance:**
- Prevent architectural collapse requiring full rewrites
- Maintain competitive technology stack without disruption
- Preserve institutional knowledge encoded in existing systems`,
        order_index: 1
      },
      {
        repository_id: REPOSITORY_ID,
        category: 'Migration Economics',
        question: 'What are the hidden costs of manual migrations and how does automation change the equation?',
        answer: `# The True Cost of Manual Migration vs. Automated Transformation

## Hidden Costs of Manual Migration

### Direct Development Costs
- **Senior Developer Time**: $150-200/hour fully loaded
- **Duration**: 6-18 months for major framework upgrades
- **Team Size**: 3-8 developers depending on codebase complexity
- **Total Cost**: $500K - $2M+ for enterprise applications

### Indirect Business Costs
- **Opportunity Cost**: Features delayed, competitive advantage lost
- **Risk Premium**: 30-50% budget contingency for unexpected issues
- **Quality Degradation**: Bug introduction rate 2-3x normal during migrations
- **Team Morale**: Developer burnout from repetitive, error-prone work

## Automated Transformation Economics

### Transformation Acceleration
- **Time Reduction**: 90-95% reduction in migration timeline
- **Resource Optimization**: 2-3 developers instead of full team
- **Predictable Outcomes**: Automated testing eliminates uncertainty
- **Immediate ROI**: First migration typically saves 10-20x tool investment

### Strategic Business Benefits
- **Competitive Agility**: Rapid adoption of new frameworks and security patches
- **Innovation Focus**: Senior developers work on architecture, not mechanical changes
- **Risk Mitigation**: Consistent, tested transformations reduce bug introduction
- **Scalable Growth**: Technical modernization keeps pace with business growth

### Real-World Example: Fortune 500 Financial Services
**Challenge**: Spring Boot 1.x → 3.x across 47 microservices
**Manual Estimate**: 18 months, 12 developers = $3.6M
**OpenRewrite Reality**: 6 weeks, 3 developers = $180K
**Additional Benefits**: 
- Security compliance achieved 16 months earlier
- Modern monitoring and observability capabilities unlocked
- Developer satisfaction increased (exit interviews showed reduced frustration)
- Technical recruitment improved (modern stack attracts talent)

The transformation from **cost center to competitive advantage** is the ultimate business case for automated code transformation.`,
        order_index: 2
      }
    ];

    await supabase.from('business_explanations').insert(businessExplanations);

    console.log('OpenRewrite example data seeded successfully!');
    return { success: true };

  } catch (error) {
    console.error('Error seeding data:', error);
    throw error;
  }
};
