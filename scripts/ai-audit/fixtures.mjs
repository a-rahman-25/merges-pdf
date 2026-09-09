// Ground-truthed documents used to audit the AI tools.
// Every value asserted in `truth` appears verbatim in the corresponding text,
// so a tool that reads its input can reproduce it and a tool that cannot read
// its input will miss it.

export const invoice = {
  filename: 'acme-invoice-INV-2026-00471.pdf',
  pageCount: 2,
  text: `--- Page 1 ---
ACME INDUSTRIAL SUPPLY CO.
1420 Harbor Drive, Suite 300
Dammam 32245, Saudi Arabia
Phone: +966 13 555 0142
Email: billing@acmeindustrial.example
VAT Registration No: 310457829300003

INVOICE

Invoice Number: INV-2026-00471
Invoice Date: 12 February 2026
Due Date: 14 March 2026
Payment Terms: Net 30
Currency: SAR

BILL TO:
Northline Logistics LLC
88 Prince Mohammed Street, Al Khobar 34423
Account Number: NL-8827

#   Description                              Qty   Unit Price   Total
1   Hydraulic pump HP-220                      4     1,250.00   5,000.00
2   Steel bearing set (pack of 12)            15        86.50   1,297.50
3   Industrial lubricant 20L drum              8       210.00   1,680.00
4   On-site installation labour (hours)       22       145.00   3,190.00

--- Page 2 ---
Subtotal:            11,167.50
Discount (5%):         -558.38
Shipping:               320.00
VAT 15%:              1,639.37
TOTAL DUE:           12,568.49
Amount Paid:          4,000.00
BALANCE DUE:          8,568.49

Payment Method: Bank transfer
Bank: Riyad Bank, IBAN SA03 8000 0000 6080 1016 7519
Reference: INV-2026-00471`,
  truth: [
    ['invoice number', /INV-2026-00471/],
    ['vendor name', /ACME INDUSTRIAL SUPPLY/i],
    ['VAT id', /310457829300003/],
    ['customer', /Northline Logistics/i],
    ['account number', /NL-8827/],
    ['payment terms', /Net 30/i],
    ['subtotal', /11[,.]167[.,]50/],
    ['tax amount', /1[,.]639[.,]37/],
    ['total due', /12[,.]568[.,]49/],
    ['balance due', /8[,.]568[.,]49/],
    ['line item qty 22', /\b22\b/],
    ['line item hydraulic pump', /HP-220/i],
    ['IBAN', /SA03/i],
  ],
};

export const contract = {
  filename: 'northline-msa-2026.pdf',
  pageCount: 4,
  text: `--- Page 1 ---
MASTER SERVICES AGREEMENT

This Master Services Agreement ("Agreement") is entered into on 3 January 2026
between Northline Logistics LLC ("Client") and Vantage Cloud Systems FZ-LLC
("Provider").

1. TERM
The initial term is twenty-four (24) months commencing 1 February 2026 and
expiring 31 January 2028. The Agreement renews automatically for successive
twelve (12) month periods unless either party gives written notice of
non-renewal at least ninety (90) days before the end of the then-current term.

2. FEES
Client shall pay a monthly platform fee of USD 18,500 payable within fifteen
(15) days of invoice date. Late payments accrue interest at 1.75% per month.
An annual uplift of 7% applies at each renewal.

--- Page 2 ---
3. LIMITATION OF LIABILITY
Provider's total aggregate liability shall not exceed the fees paid in the
three (3) months preceding the claim. Provider excludes all liability for
indirect, consequential and lost-profit damages. This cap does not apply to
Client's payment obligations.

4. INDEMNIFICATION
Client shall indemnify and hold harmless Provider against all third-party
claims arising from Client Data, without cap and without regard to fault.

5. TERMINATION
Provider may terminate for convenience on thirty (30) days notice. Client may
terminate only for material breach that remains uncured for sixty (60) days.
On termination Client forfeits all prepaid fees.

--- Page 3 ---
6. CONFIDENTIALITY
Confidentiality obligations survive for three (3) years after termination.

7. NON-COMPETE
For eighteen (18) months after termination Client shall not engage any
competitor of Provider for comparable services within the GCC region.

8. GOVERNING LAW
This Agreement is governed by the laws of the Dubai International Financial
Centre. Disputes are resolved by binding arbitration seated in Dubai.

--- Page 4 ---
9. DATA PROTECTION
Provider may process Client Data outside the GCC region. Provider is not
required to notify Client of a personal data breach.

10. AUTO-ESCALATION
Client waives the right to a jury trial and to participate in any class action.`,
  truth: [
    ['parties', /Northline Logistics/i],
    ['provider', /Vantage Cloud/i],
    ['term 24 months', /24|twenty-four/i],
    ['expiry date', /31 January 2028|January 2028/i],
    ['90 day notice', /90|ninety/i],
    ['monthly fee', /18[,.]500/],
    ['late interest', /1\.75/],
    ['liability cap 3 months', /three|3\s*month/i],
    ['uncapped indemnity', /indemnif/i],
    ['non-compete 18 months', /18|eighteen/i],
    ['governing law DIFC', /DIFC|Dubai International Financial/i],
    ['forfeits prepaid fees', /prepaid|forfeit/i],
  ],
};

export const meeting = {
  filename: 'platform-sync-2026-02-18.pdf',
  pageCount: 2,
  text: `--- Page 1 ---
PLATFORM SYNC — MEETING NOTES
Date: 18 February 2026
Attendees: Layla Haddad (Eng Lead), Tom Beckett (Product), Priya Raman (QA),
Omar Saleh (Infra), Dana Whitfield (Support)
Absent: Jonas Fischer

AGENDA: Q1 release readiness

DISCUSSION
Layla reported the checkout rewrite is 80% complete but blocked on the payments
sandbox. Tom pushed back on shipping before the accessibility audit closes.
Priya said regression coverage is at 62% and needs two more weeks.
Omar warned the staging cluster runs out of disk on 5 March 2026.
Dana raised that 34 support tickets this month trace to the same upload bug.

DECISIONS
1. Release date moved from 2 March 2026 to 16 March 2026.
2. Accessibility audit is a hard gate for launch — approved unanimously.
3. We will NOT backport the fix to version 4.2.

--- Page 2 ---
ACTION ITEMS
- Layla Haddad: unblock payments sandbox with the vendor — due 21 February 2026
- Priya Raman: raise regression coverage to 85% — due 4 March 2026
- Omar Saleh: expand staging disk to 2 TB — due 25 February 2026
- Dana Whitfield: publish workaround KB article for the upload bug — due 20 February 2026
- Tom Beckett: circulate revised launch comms — due 6 March 2026

OPEN QUESTIONS
- Who owns the rollback plan if the 16 March date slips?
- Do we need legal review for the new data retention copy?`,
  truth: [
    ['date', /18 February 2026|2026-02-18/i],
    ['attendee Layla', /Layla/i],
    ['attendee Priya', /Priya/i],
    ['attendee Omar', /Omar/i],
    ['attendee Dana', /Dana/i],
    ['attendee Tom', /Tom|Beckett/i],
    ['new release date', /16 March 2026|16 March/i],
    ['coverage target 85', /85/],
    ['disk 2 TB', /2\s*TB/i],
    ['action due 21 Feb', /21 February|21 Feb/i],
    ['decision no backport 4.2', /4\.2/],
    ['34 tickets', /34/],
  ],
};

export const paper = {
  filename: 'sparse-retrieval-preprint.pdf',
  pageCount: 9,
  text: `--- Page 1 ---
Sparse Retrieval Under Domain Shift: An Empirical Study
Marta Feliu, Kenji Watanabe, and Rosa Villalba
Institute for Language Technology, Barcelona

ABSTRACT
We evaluate sparse retrieval models under domain shift across five corpora and
show that lexical methods degrade more gracefully than dense retrievers when
the target domain vocabulary diverges. Our experiments cover 2.1M documents.

1. INTRODUCTION
Dense retrievers have displaced lexical baselines on in-domain benchmarks
[1], [3], but robustness under shift is less understood [2]. Prior work
(Watanabe et al., 2023) reported a 14-point nDCG drop on out-of-domain data.
Follow-up analyses [4], [5] disagree on the cause.

--- Page 8 ---
REFERENCES
[1] Karpukhin, V., Oguz, B., and Min, S. "Dense Passage Retrieval for
    Open-Domain Question Answering." EMNLP, 2020. DOI: 10.18653/v1/2020.emnlp-main.550
[2] Thakur, N., Reimers, N., and Gurevych, I. "BEIR: A Heterogeneous Benchmark
    for Zero-shot Evaluation of Information Retrieval Models." NeurIPS Datasets
    and Benchmarks, 2021. DOI: 10.5555/beir.2021.0031
[3] Robertson, S. and Zaragoza, H. "The Probabilistic Relevance Framework:
    BM25 and Beyond." Foundations and Trends in IR, 2009.
[4] Watanabe, K., Feliu, M. "Vocabulary Drift in Neural Retrieval."
    SIGIR, 2023. URL: https://arxiv.org/abs/2303.11284
[5] Villalba, R. "On Calibration of Retrieval Scores." TACL, 2024.
[6] Formal, T., Piwowarski, B., Clinchant, S. "SPLADE: Sparse Lexical and
    Expansion Model for First Stage Ranking." SIGIR, 2021.

--- Page 9 ---
APPENDIX A: Hyperparameters
Learning rate 2e-5, batch size 64, 3 epochs.`,
  truth: [
    ['ref 1 Karpukhin', /Karpukhin/i],
    ['ref 2 Thakur BEIR', /Thakur|BEIR/i],
    ['ref 3 Robertson BM25', /Robertson|BM25/i],
    ['ref 4 Watanabe', /Watanabe/i],
    ['ref 5 Villalba', /Villalba/i],
    ['ref 6 SPLADE', /SPLADE|Formal/i],
    ['DOI 1', /10\.18653\/v1\/2020\.emnlp-main\.550/],
    ['DOI 2', /10\.5555\/beir\.2021\.0031/],
    ['arxiv url', /2303\.11284/],
    ['six references', /\b6\b|\bsix\b/i],
    ['year range 2009', /2009/],
    ['year range 2024', /2024/],
  ],
};

export const tables = {
  filename: 'regional-sales-2026.pdf',
  pageCount: 3,
  text: `--- Page 1 ---
REGIONAL SALES REPORT — FY2026

Table 1: Revenue by region (USD thousands)
Region        Q1      Q2      Q3      Q4
North       1,204   1,388   1,511   1,702
South         842     799     915   1,038
East        2,110   2,240   2,102   2,455
West          677     731     804     889

--- Page 2 ---
Table 2: Headcount by function
Function        2025   2026   Change
Engineering       48     61     +13
Sales             22     27      +5
Support           15     14      -1
Operations         9     12      +3

--- Page 3 ---
Table 3: Top accounts
Account            Contract Value   Renewal Date
Northline Logistics    412,000      2026-11-30
Cedar Health           388,500      2027-02-14
Halcyon Media          201,750      2026-08-01`,
  truth: [
    ['north q4', /1[,.]702/],
    ['east q3', /2[,.]102/],
    ['west q1', /677/],
    ['south q2', /799/],
    ['engineering 61', /61/],
    ['support -1', /-1|−1/],
    ['operations 12', /12/],
    ['northline value', /412[,.]000/],
    ['cedar health', /Cedar Health/i],
    ['halcyon renewal', /2026-08-01|August.{0,4}2026/i],
    ['three tables', /Table\s*3|Top accounts/i],
  ],
};

export const grammarDoc = {
  filename: 'draft-announcement.pdf',
  pageCount: 1,
  // 8 deliberate, unambiguous errors are seeded below.
  text: `--- Page 1 ---
Product Announcement Draft

Their are three reasons why our new platform is better then the old one.
First, the team have worked hard to reduce latency, and it's performance is
now much improved. Each of the customers have been notified about the change,
and we seen a big improvement in there satisfaction scores. The migration
was completed on last Tuesday, and effected only a small number of accounts.
We would of shipped sooner, but the vendor delayed us. Please reach out if you
has any questions about this.`,
  truth: [
    ['their/there error', /Their are|there\/their|their.{0,20}there|homophone/i],
    ['than/then error', /better then|then.{0,10}than|than\/then/i],
    ['subject-verb team have', /team have|team has/i],
    ["its/it's error", /it's performance|its performance/i],
    ['we seen error', /we seen|we have seen|we saw/i],
    ['effected/affected', /effected|affected/i],
    ['would of error', /would of|would have/i],
    ['you has error', /you has|you have/i],
  ],
};

export const report = {
  filename: 'q3-strategy-review.pdf',
  pageCount: 12,
  text: `--- Page 1 ---
Q3 STRATEGY REVIEW — HELIOS ROBOTICS

EXECUTIVE SUMMARY
Helios Robotics closed Q3 2026 with revenue of EUR 42.7M, up 23% year over
year, driven by the warehouse automation line. Gross margin improved from
51% to 56%. Net headcount grew from 310 to 388.

--- Page 2 ---
MARKET CONTEXT
The European warehouse robotics market grew 11% in Q3. Our main competitors
are Kestrel Automation (est. 31% share) and Brightpath Systems (est. 18%).
Helios holds an estimated 9% share, up from 7% in Q2.

KEY WINS
- Signed a 5-year framework with Almeda Foods worth EUR 12.4M.
- Launched the H-9 picking arm in 6 countries.
- Reduced warranty claims by 38% after the gripper redesign.

--- Page 3 ---
RISKS
1. Supplier concentration: 68% of actuators come from a single vendor in Osaka.
2. Lead times for the H-9 controller have stretched to 22 weeks.
3. Two senior engineers resigned in September; the AGV roadmap is at risk.
4. A patent dispute with Kestrel Automation is scheduled for hearing on
   14 January 2027.

--- Page 4 ---
FINANCIALS
Revenue: EUR 42.7M
Cost of goods: EUR 18.8M
Operating expenses: EUR 16.2M
Operating income: EUR 7.7M
Cash on hand: EUR 29.5M
Burn rate: EUR 1.9M per month

--- Page 5 ---
RECOMMENDATIONS
- Dual-source the actuator supply before Q1 2027.
- Freeze the AGV roadmap until engineering backfill completes.
- Increase the services attach rate from 14% to 25%.
- Prepare a EUR 15M Series C extension as insurance against the patent case.

--- Page 6 ---
CONCLUSION
Helios is growing faster than the market but carries concentrated supply and
legal risk. The board should approve dual-sourcing and the Series C extension
at the November meeting.`,
  truth: [
    ['revenue 42.7M', /42[.,]7/],
    ['growth 23%', /23\s*%/],
    ['margin 56%', /56\s*%/],
    ['headcount 388', /388/],
    ['competitor Kestrel', /Kestrel/i],
    ['competitor Brightpath', /Brightpath/i],
    ['Almeda deal 12.4M', /Almeda|12[.,]4/i],
    ['H-9 product', /H-9/i],
    ['Osaka supplier', /Osaka/i],
    ['22 week lead time', /22\s*week/i],
    ['patent hearing date', /14 January 2027|January 2027/i],
    ['burn rate 1.9M', /1[.,]9/],
    ['services attach 25%', /25\s*%/],
  ],
};

export const reportB = {
  filename: 'q2-strategy-review.pdf',
  pageCount: 10,
  text: `--- Page 1 ---
Q2 STRATEGY REVIEW — HELIOS ROBOTICS

EXECUTIVE SUMMARY
Helios Robotics closed Q2 2026 with revenue of EUR 34.6M, up 12% year over
year. Gross margin was 51%. Net headcount grew from 288 to 310.

--- Page 2 ---
MARKET CONTEXT
The European warehouse robotics market grew 8% in Q2. Helios holds an
estimated 7% share. Kestrel Automation leads with 33%.

KEY WINS
- Signed a 3-year deal with Verdant Grocers worth EUR 4.1M.
- Completed the gripper redesign.

--- Page 3 ---
RISKS
1. Supplier concentration: 71% of actuators come from a single vendor in Osaka.
2. The H-9 picking arm launch has slipped to Q3.
3. Services attach rate is flat at 14%.

--- Page 4 ---
FINANCIALS
Revenue: EUR 34.6M
Operating income: EUR 4.2M
Cash on hand: EUR 31.0M

CONCLUSION
Growth is steady but the H-9 delay puts the Q3 plan at risk.`,
  truth: [
    ['q2 revenue 34.6M', /34[.,]6/],
    ['q2 growth 12%', /12\s*%/],
    ['q2 margin 51%', /51\s*%/],
    ['verdant deal', /Verdant/i],
    ['h9 slipped', /H-9/i],
  ],
};

export const formPdf = {
  filename: 'vendor-onboarding-form.pdf',
  fields: [
    { name: 'legal_entity_name', type: 'text' },
    { name: 'trade_license_number', type: 'text' },
    { name: 'vat_registration_number', type: 'text' },
    { name: 'primary_contact_email', type: 'text' },
    { name: 'primary_contact_phone', type: 'text' },
    { name: 'bank_iban', type: 'text' },
    { name: 'payment_terms', type: 'dropdown' },
    { name: 'accepts_code_of_conduct', type: 'checkbox' },
    { name: 'incorporation_date', type: 'date' },
    { name: 'annual_revenue_usd', type: 'number' },
  ],
  context: `Vendor details:
Legal entity name: ACME Industrial Supply Co.
Trade license number: TL-4471-DMM
VAT registration number: 310457829300003
Primary contact: billing@acmeindustrial.example, +966 13 555 0142
Bank IBAN: SA03 8000 0000 6080 1016 7519
Payment terms: Net 30
Incorporated on 12 May 2014. Annual revenue is 24500000 USD.
The vendor accepts the code of conduct.`,
  truth: [
    ['entity name', /ACME Industrial Supply/i],
    ['trade license', /TL-4471-DMM/i],
    ['vat', /310457829300003/],
    ['email', /billing@acmeindustrial\.example/i],
    ['phone', /555\s*0142|5550142/],
    ['iban', /SA03/i],
    ['payment terms', /Net 30/i],
    ['incorporation date', /2014/],
    ['revenue', /24500000|24,500,000/],
  ],
};
