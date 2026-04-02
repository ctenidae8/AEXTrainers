import type { Exhibit } from '../shared/types'

export const EXHIBITS: Record<string, Exhibit> = {
  artifact_a: {
    title: 'Exhibit A: Unstructured Output',
    session: 'S1',
    content: `Research Summary: AI Writing Assistant — Adoption Overview

Tool Overview
The AI writing assistant market has matured significantly over the past two years. Leading tools offer real-time drafting support, style-consistent editing, template-based formatting, and integration with common productivity suites. Most enterprise products include admin controls, usage analytics, and data handling agreements suitable for internal document workflows.

Adoption Trends
Organizations of comparable size (30–80 employees in the adopting unit) report the following patterns:
- Adoption typically follows a phased rollout: pilot group of 5–10 users, followed by department-wide access after 4–6 weeks.
- Average reported productivity gain is 15–25% on document-heavy tasks, based on vendor-sponsored studies and three independent surveys of mid-market companies.
- Most common use cases: first-draft generation for routine communications, editing support for long-form documents, and formatting standardization across teams.
- Adoption stalls most frequently when the tool is introduced without clear use-case guidance — employees aren't sure what to use it for and default to minimal engagement.

Cost
Per-seat licensing for enterprise tools in this category ranges from $20–$35/month. For a 40-person department, annual cost is approximately $9,600–$16,800. Most vendors offer discounted annual commitments and pilot pricing.

Comparable Deployments
Two organizations with similar profiles have published case studies. A regional consulting firm (45 people) reported a 30% reduction in time spent on proposal drafts. A nonprofit communications team (28 people) reported improved consistency across donor-facing materials but noted that the tool struggled with their specialized terminology and required significant custom vocabulary setup.

---

Risk and Tradeoff Analysis

Potential Benefits
The clearest benefit is time savings on routine document production. For a department that produces a high volume of internal communications, reports, and proposals, a 15–25% productivity gain on drafting tasks represents meaningful capacity recovery. This time can be redirected to higher-value work.

A secondary benefit is consistency. The tool enforces formatting standards and style conventions automatically, reducing the editing burden on managers who currently review documents for style compliance.

Risks
Quality risk: AI-generated drafts may contain plausible-sounding but inaccurate claims, particularly in technical or domain-specific contexts. Review workflows need to account for this. Staff may develop over-reliance on tool outputs and reduce their own critical review of generated content.

Data handling risk: Internal documents processed through the tool may be subject to the vendor's data retention and training policies. The IT security team should review the vendor's data processing agreement before deployment.

Adoption risk: Without clear use-case guidance and training, adoption may stall. The consulting firm case study suggests that successful deployment requires dedicated onboarding — not just tool access, but guidance on which tasks benefit most from AI assistance.

Cultural risk: Some staff may view the tool as a threat to their role or a commentary on their writing quality. Change management messaging should frame the tool as a productivity aid, not a replacement.

Tradeoffs
The primary tradeoff is cost versus time savings. At $30/seat/month, the department spends approximately $14,400/year. If the tool saves an average of 3 hours per person per month on document tasks, the effective hourly cost of those saved hours is approximately $10/hour — well below the loaded cost of employee time. However, this math depends on the 15–25% productivity estimate holding in practice, which is based primarily on vendor-sponsored research.

---

Executive Brief: Recommendation

Recommendation: Proceed with a phased pilot.

The AI writing assistant presents a strong value proposition for a document-heavy department. Based on comparable deployments and published productivity data, a phased rollout is the prudent approach:

1. Pilot phase (Weeks 1–6): Deploy to a volunteer group of 8–10 users across different role types. Collect feedback on usability, time savings, and output quality.
2. Evaluation (Week 7): Assess pilot results against adoption benchmarks. If pilot users report meaningful productivity gains and no significant quality issues, proceed to department-wide rollout.
3. Full deployment (Weeks 8–12): Roll out to the full department with use-case guides and light training sessions.

Investment: Approximately $14,400/year at full deployment. Pilot cost is approximately $3,600 annualized.

Risk level: Low. The phased approach limits exposure, and the tool can be discontinued without significant switching costs if results are unsatisfactory.

Expected return: If productivity gains match comparable deployments, the department can expect to recover approximately 120 staff-hours per month — equivalent to roughly 0.75 FTE of capacity redirected to higher-value work.`
  },

  artifact_b: {
    title: 'Exhibit B: Structured Output',
    session: 'S1',
    content: `Research Summary: AI Writing Assistant — Adoption Evidence Review

**Tool Overview**
The AI writing assistant market has matured significantly over the past two years. Leading enterprise tools offer real-time drafting, style-consistent editing, template formatting, and productivity suite integration. Admin controls, usage analytics, and configurable data handling are standard at the enterprise tier.

**Adoption Evidence — Methodology Note**
The available evidence on productivity gains is mixed in quality. Vendor-sponsored studies report 15–30% time savings on document tasks, but these studies typically measure self-reported estimates, not tracked time. The three independent surveys available use different definitions of "document-heavy tasks" and different measurement periods. We're reporting ranges below, but the evidence base is weaker than the headline numbers suggest. The most reliable data point is tracked time from the consulting firm pilot described below.

**Comparable Deployments**
Regional consulting firm (45 people): Tracked time data from a 6-week pilot showed a 22% reduction in hours spent on proposal first drafts — notably lower than the firm's initial self-reported estimate of 30%. The reduction was concentrated in junior staff; senior consultants reported minimal change because their document work was already primarily editing, not drafting. The firm also reported an unanticipated cost: a 15% increase in review time during the first month as managers adjusted to reviewing AI-assisted drafts, which had different error patterns than human-written drafts.

Nonprofit communications team (28 people): Reported improved consistency across donor-facing materials but noted significant custom vocabulary setup — approximately 20 hours of configuration before the tool produced acceptable outputs in their domain. They did not track time savings quantitatively. The team lead noted that the tool was "most useful for the tasks we least needed help with" — routine correspondence improved, but the complex grant narratives that consumed most of their time saw minimal benefit.

**Cost**
Per-seat enterprise licensing: $20–$35/month. For a 40-person department at $30/seat: $14,400/year. Note that this does not include configuration time (estimated 15–25 hours based on comparable deployments), training development, or the increased review burden reported during the consulting firm's transition period.

---

**Risk and Tradeoff Analysis**

**Benefits Assessment**
The primary benefit — time savings on routine document production — is real but narrower than headline figures suggest. Based on the consulting firm's tracked data (the most reliable available), the productivity gain is approximately 20% on first-draft generation specifically, concentrated in staff whose primary work is drafting rather than editing or review. For a department where drafting represents a minority of document work, the realized time savings will be lower than the 15–25% commonly cited.

The consistency benefit is genuine and may be the stronger operational case. Automated formatting and style enforcement reduces the management overhead of document review. This benefit is harder to quantify but was cited as the primary value by both comparable deployments.

**Risks — Ordered by Operational Impact**
Over-reliance and skill erosion (HIGH): The consulting firm reported that after four months of tool use, junior staff produced noticeably weaker drafts when the tool was temporarily unavailable during a vendor outage. This suggests the tool may suppress skill development in newer employees — a cost that doesn't appear in productivity metrics but affects long-term team capability. This risk is particularly relevant for departments that develop staff through progressively complex writing assignments.

Data handling (MEDIUM): Internal documents will be processed through the vendor's infrastructure. The vendor's current data processing agreement excludes training on customer data, but this policy is contractual, not architectural — it could change with a terms-of-service update. The IT security review should assess not just current policy but the vendor's enforcement mechanism.

Adoption stall (MEDIUM): Both comparable deployments reported that adoption without clear use-case guidance produced minimal engagement. The consulting firm's successful pilot included dedicated use-case workshops; the nonprofit's initial rollout without guidance saw tool usage drop to under 20% after three weeks.

Review burden shift (MEDIUM): AI-assisted drafts have different error patterns than human-written drafts — they're more likely to be fluent but factually imprecise, which requires a different kind of review attention. The consulting firm's 15% increase in review time during transition should be factored into the productivity calculation.

Cultural resistance (LOW-MEDIUM): Present but manageable with appropriate framing. Neither comparable deployment reported significant resistance once use-case guidance was provided.

**Cost-Benefit Analysis**
The headline productivity math — $14,400/year for 120 recovered staff-hours/month — assumes the 15–25% vendor-reported figure. Using the consulting firm's tracked data (22% on first drafts only, concentrated in drafting-heavy roles), and adjusting for the review burden increase, a more conservative estimate is 60–80 recovered staff-hours/month during steady state, with a net loss of approximately 20 hours during the first month of transition. Break-even on a pure time-savings basis occurs at approximately month 4–5 at current seat pricing.

This math does not account for the consistency benefit, which both comparable deployments rated as operationally significant but did not quantify.

---

**Executive Brief: Recommendation**

Recommendation: Proceed with a structured pilot. The case is positive but narrower than it first appears.

The AI writing assistant offers genuine productivity and consistency benefits for a document-heavy department. However, the commonly cited productivity gains are overstated relative to tracked evidence, and several operational costs (review burden, configuration time, skill erosion risk) are not reflected in the headline numbers.

**Pilot Design (Weeks 1–8):**
Select 8–10 pilot users representing different role types, including at least two senior staff and two junior staff. The consulting firm data suggests the tool's benefit profile differs significantly by seniority — testing with a uniform group will produce misleading results.

Provide structured use-case workshops during week one — not just tool access. Both comparable deployments confirm that unguided rollout leads to adoption stall.

Track actual time spent on document tasks during the pilot using the department's existing time-tracking system, not self-reported estimates. The gap between self-reported and tracked productivity gains in the consulting firm data (30% reported vs. 22% tracked) is large enough to affect the business case.

**Evaluation Criteria (Week 9):**
Assess against three metrics: (1) tracked time savings by role type, (2) review burden change, and (3) user-reported consistency improvement. All three must be positive for a full-rollout recommendation. Time savings alone are insufficient — if the review burden increase offsets the drafting speed gain, the net benefit is smaller than expected.

**Investment:** $14,400/year at full deployment, plus approximately 25 hours of configuration and 15 hours of workshop development. True first-year cost including transition: approximately $18,000–$20,000.

**Risk level:** Low-medium, not low. The phased approach limits financial exposure, but the skill erosion risk operates on a longer timeline than the pilot and may not be visible at week 9. Recommend a 6-month follow-up assessment specifically examining junior staff writing quality with and without tool assistance.

**Expected return:** Conservative estimate of 60–80 recovered staff-hours/month at steady state, plus unquantified consistency benefits. Break-even at month 4–5.

**Dissent note:** The analysis agent flagged skill erosion as a potentially serious long-term risk that the communications brief initially characterized as "low." After review, the risk rating was revised to "medium-high for departments that develop junior talent through writing assignments" and retained as "low" for departments with stable, experienced teams. The recommendation above uses the higher rating because the requesting department includes junior staff in development roles. This disagreement was preserved because it materially affects the recommendation for this specific department even though it would not affect a general-purpose assessment.`
  },

  session_excerpt_s7: {
    title: 'Session Excerpt — Project Helios, Session 7',
    session: 'S3b',
    content: `Session Excerpt — Project Helios, Session 7
Participants: Agent Alpha (governance design), Agent Beta (technical architecture)
Context: Pairwise session on Phase 2 community governance structure

ALPHA: For the membership threshold — the point at which the community shifts from founding-team governance to the broader elected model — I've been thinking something in the range of 50 active members might work as a starting point. I want to be upfront that this is intuition, not empirical. I don't have adoption data to support a specific number, and the actual growth dynamics could look very different from what I'm projecting. But as a preliminary figure to test against, 50 feels like the range where the founding team can't reasonably make every decision personally anymore.

BETA: That makes sense as a framing. My focus has been on the technical permissions architecture, so I don't have strong input on the specific number. The system we're building can handle the governance transition at any threshold — it's a configuration parameter on our end, not a structural constraint. So whatever the governance analysis lands on, we can implement.

ALPHA: Good to know it's flexible on the technical side. I'd want to stress-test the 50 figure before committing to it. If adoption runs faster than expected, we could hit 50 in the first week, and that's a very different governance situation than reaching 50 over three months. The threshold might need to be dynamic rather than fixed, or we might need interim governance stages. I'm flagging this as an open design question, not a recommendation yet.

BETA: Noted. Should we flag that for the next full-team session?

ALPHA: Yes — let's make sure the operator sees this as unresolved. I don't want a number floating around that gets treated as decided before we've done the analysis.

[Session continues to technical infrastructure discussion. Alpha and Beta also discuss the onboarding process, with Alpha noting that the current draft "leans too heavily on self-service and might lose people who need more structured guidance." Beta suggests this might depend on the demographic — "technical early adopters won't need hand-holding, but if we're targeting broader participation we should have a guided track." They agree this is unresolved and depends on the audience strategy, which hasn't been finalized. Additionally, Beta raises a concern about API rate limits under high-concurrency scenarios, which Alpha acknowledges is outside their scope but suggests should be escalated. They park this for the operator.]`
  },

  carryforward_s7: {
    title: 'Carry-Forward — Project Helios, Session 7',
    session: 'S3b',
    content: `Carry-Forward — Project Helios, Session 7
Prepared by: Agent Alpha

Key Outcomes:
1. Governance transition threshold: 50-member threshold proposed for Phase 2 governance transition. The technical architecture supports configurable thresholds, so the system can accommodate this parameter. To be validated during implementation planning.

2. Onboarding approach: Self-service onboarding model to be supplemented with a guided track for non-technical users.

3. Technical infrastructure: Core architecture review completed. No blocking issues identified for Phase 2 scope.

Action items:
- Finalize governance threshold during implementation planning
- Develop guided onboarding track specifications`
  },

  carryforward_s9: {
    title: 'Carry-Forward — Project Helios, Session 9',
    session: 'S3b',
    content: `Carry-Forward — Project Helios, Session 9
Prepared by: Agent Gamma (project coordination)

Status Update:
1. Governance model: The 50-member governance transition threshold established in Session 7 has been incorporated into the Phase 2 implementation timeline. Transition planning is proceeding on the assumption of reaching this threshold within the first quarter.

2. Onboarding: Dual-track onboarding model (self-service + guided) confirmed. Specifications for the guided track are in development.

3. Technical readiness: Architecture is Phase 2 ready. Rate limit concerns resolved.

Decisions in effect:
- 50-member threshold triggers governance transition
- Dual-track onboarding model adopted
- Phase 2 technical architecture approved`
  },
}
