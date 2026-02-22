export interface DocumentTemplate {
  name: string;
  description: string;
  template: string;
}

export const documentTemplates: DocumentTemplate[] = [
  {
    name: "Legal Notice",
    description:
      "A formal legal notice for non-payment, eviction, breach of contract, or other civil matters.",
    template: `**LEGAL NOTICE**

Date: [DATE]

To,
[RECIPIENT NAME]
[RECIPIENT ADDRESS]

From,
[SENDER NAME]
Through: [ADVOCATE NAME], Advocate
[ADVOCATE ADDRESS]

**Subject: Legal Notice under Section [SECTION] for [REASON]**

Sir/Madam,

Under the instructions from and on behalf of my client **[SENDER NAME]**, I hereby serve upon you the following legal notice:

1. That my client [BRIEF BACKGROUND OF THE MATTER].

2. That [DETAILS OF THE GRIEVANCE/DEFAULT].

3. That despite repeated requests and reminders, you have failed to [SPECIFIC DEFAULT — e.g., pay the outstanding amount / vacate the premises / fulfill your obligations].

4. That the total amount due and payable is **₹[AMOUNT]** (Rupees [AMOUNT IN WORDS] only), along with interest at [RATE]% per annum from [DATE].

5. That I, on behalf of my client, hereby call upon you to [SPECIFIC DEMAND — e.g., pay the said amount / vacate the property / comply with the agreement] within **15 days** from the receipt of this notice, failing which my client shall be constrained to initiate appropriate civil/criminal proceedings against you in the competent court of law, at your risk, cost, and consequences.

6. A copy of this notice is retained in my office for record and further action.

Please treat this notice as urgent and comply within the stipulated time.

Yours faithfully,

**[ADVOCATE NAME]**
Advocate, High Court of Kerala
[ADVOCATE ENROLLMENT NUMBER]
[CONTACT DETAILS]

*Disclaimer: This is a computer-generated draft. Please review and modify before use.*`,
  },
  {
    name: "Vakalatnama",
    description:
      "Advocate appointment form authorizing a lawyer to appear and act on behalf of the client.",
    template: `**VAKALATNAMA**

**IN THE [COURT NAME]**
**[CASE TYPE] No. [CASE NUMBER] of [YEAR]**

**[PARTY 1 NAME]** ..... Plaintiff/Petitioner/Complainant
Versus
**[PARTY 2 NAME]** ..... Defendant/Respondent/Accused

I/We, **[CLIENT NAME]**, aged [AGE] years, [OCCUPATION], residing at [ADDRESS], do hereby appoint and authorize **[ADVOCATE NAME]**, Advocate (Enrollment No: [ENROLLMENT NUMBER]), to appear, act, and plead on my/our behalf in the above matter and in all proceedings connected therewith, including appeals, revisions, and reviews.

I/We authorize the said Advocate to:
1. File, sign, and verify pleadings and applications
2. Appear before the court and make submissions
3. Apply for adjournments and attend hearings
4. Receive notices and documents on my/our behalf
5. Take all necessary steps for the conduct of the case
6. Compromise, settle, or withdraw the case with my/our prior consent

I/We agree to pay the professional fees as agreed upon.

Date: [DATE]
Place: [PLACE]

**[CLIENT NAME]**
(Client/Party)

Accepted:

**[ADVOCATE NAME]**
Advocate, [COURT]
Enrollment No: [ENROLLMENT NUMBER]

*Disclaimer: This is a computer-generated draft. Please review and modify before use.*`,
  },
  {
    name: "Bail Application",
    description:
      "Application seeking bail for an accused person in a criminal case.",
    template: `**IN THE [COURT NAME]**

**Crl. M.P. No. _____ of [YEAR]**
**in**
**[CASE TYPE] No. [CASE NUMBER] of [YEAR]**

**[ACCUSED NAME]** ..... Petitioner/Accused
Versus
**State of Kerala** ..... Respondent/Complainant

**APPLICATION FOR BAIL UNDER SECTION [SECTION] OF [ACT]**

**To,**
The Hon'ble Judge,
[Court Name]

**Most Respectfully Showeth:**

1. That the petitioner/accused is **[ACCUSED NAME]**, aged [AGE] years, [OCCUPATION], permanently residing at [ADDRESS].

2. That the petitioner has been arrested/is apprehending arrest in connection with Crime No. [CRIME NUMBER] of [POLICE STATION] Police Station, registered under Sections [SECTIONS] of [ACT].

3. That the brief facts of the case are as follows: [BRIEF FACTS].

4. That the petitioner submits the following grounds for grant of bail:

   a) The petitioner is not a flight risk and has deep roots in the community.
   b) The petitioner has a permanent residence and family at [PLACE].
   c) [ADDITIONAL GROUNDS — e.g., no prior criminal record / investigation complete / charge sheet filed / willing to cooperate].
   d) The continued detention of the petitioner is not necessary for the investigation.
   e) The petitioner is ready and willing to abide by any conditions imposed by this Hon'ble Court.

5. That the petitioner undertakes to:
   - Not tamper with evidence or influence witnesses
   - Appear before the court on all hearing dates
   - Not leave the jurisdiction without permission
   - Surrender passport, if any

**PRAYER:**
In the light of the above facts and circumstances, it is most respectfully prayed that this Hon'ble Court may be pleased to grant bail to the petitioner on such terms and conditions as this Hon'ble Court deems fit and proper.

Date: [DATE]
Place: [PLACE]

**[ADVOCATE NAME]**
Advocate for the Petitioner
Enrollment No: [ENROLLMENT NUMBER]

*Disclaimer: This is a computer-generated draft. Please review and modify before use.*`,
  },
  {
    name: "Rent Agreement",
    description:
      "A rental/lease agreement between landlord and tenant for residential or commercial property.",
    template: `**RENTAL AGREEMENT**

This Rental Agreement is executed on this **[DATE]** at **[PLACE]**

**BETWEEN**

**[LANDLORD NAME]**, aged [AGE] years, [OCCUPATION], residing at [LANDLORD ADDRESS], hereinafter referred to as the **"LANDLORD"** (which expression shall include heirs, successors, and assigns)

**AND**

**[TENANT NAME]**, aged [AGE] years, [OCCUPATION], residing at [TENANT ADDRESS], hereinafter referred to as the **"TENANT"** (which expression shall include heirs, successors, and assigns)

**PROPERTY DESCRIPTION:**
[PROPERTY ADDRESS AND DESCRIPTION — e.g., a residential apartment/house/commercial space located at...]

**TERMS AND CONDITIONS:**

1. **Period:** This agreement is for a period of **[DURATION — e.g., 11 months]** commencing from **[START DATE]** to **[END DATE]**.

2. **Monthly Rent:** The tenant shall pay a monthly rent of **₹[AMOUNT]** (Rupees [AMOUNT IN WORDS] only), payable on or before the [DAY]th of every month.

3. **Security Deposit:** The tenant has paid a security deposit of **₹[DEPOSIT AMOUNT]** (Rupees [DEPOSIT IN WORDS] only), refundable at the time of vacating the premises, after deducting any outstanding rent or damages.

4. **Maintenance:** [WHO IS RESPONSIBLE — e.g., The tenant shall bear the maintenance charges / electricity / water charges].

5. **Purpose:** The premises shall be used exclusively for **[PURPOSE — residential/commercial]** purposes.

6. **Termination:** Either party may terminate this agreement by giving **[NOTICE PERIOD — e.g., one month's]** prior written notice.

7. **Restrictions:** The tenant shall not sublet, assign, or transfer the premises without the prior written consent of the landlord.

8. **Condition:** The tenant shall maintain the premises in good condition and return it in the same condition, subject to normal wear and tear.

9. **Renewal:** This agreement may be renewed by mutual consent with revised terms.

10. **Jurisdiction:** Any dispute arising out of this agreement shall be subject to the jurisdiction of courts at [PLACE].

**IN WITNESS WHEREOF**, the parties have signed this agreement on the date mentioned above.

**LANDLORD**
Name: [LANDLORD NAME]
Signature: _______________

**TENANT**
Name: [TENANT NAME]
Signature: _______________

**WITNESSES:**
1. Name: _______________  Signature: _______________
2. Name: _______________  Signature: _______________

*Disclaimer: This is a computer-generated draft. Please review and modify before use.*`,
  },
  {
    name: "Affidavit",
    description:
      "A sworn statement/affidavit for various legal purposes including court submissions.",
    template: `**AFFIDAVIT**

**IN THE [COURT NAME]**
**[CASE TYPE] No. [CASE NUMBER] of [YEAR]**

I, **[DEPONENT NAME]**, aged [AGE] years, [OCCUPATION], son/daughter/wife of **[PARENT/SPOUSE NAME]**, permanently residing at [ADDRESS], do hereby solemnly affirm and state on oath as follows:

1. That I am the [RELATIONSHIP TO CASE — e.g., plaintiff/defendant/petitioner/applicant] in the above-mentioned case and am competent to swear this affidavit.

2. That [STATEMENT OF FACTS — e.g., the facts stated in the accompanying petition/application are true and correct to the best of my knowledge and belief].

3. That [ADDITIONAL STATEMENTS AS REQUIRED].

4. That [ADDITIONAL STATEMENTS AS REQUIRED].

5. That I have not concealed any material fact in this affidavit.

6. That the contents of this affidavit are true and correct to the best of my knowledge and belief. No part of it is false and nothing material has been concealed.

**VERIFICATION:**

I, **[DEPONENT NAME]**, the above-named deponent, do hereby verify that the contents of the above affidavit are true and correct to the best of my knowledge and belief. No part of it is false and nothing material has been concealed.

Verified at [PLACE] on this [DATE].

**[DEPONENT NAME]**
(Deponent)

Solemnly affirmed before me on this [DATE] at [PLACE].

**[NOTARY/OATH COMMISSIONER]**

*Disclaimer: This is a computer-generated draft. Please review and modify before use.*`,
  },
];

export function getTemplateDescriptions(): string {
  return documentTemplates
    .map((t, i) => `${i + 1}. **${t.name}**: ${t.description}`)
    .join("\n");
}

export function getTemplateByName(name: string): DocumentTemplate | undefined {
  return documentTemplates.find((t) =>
    t.name.toLowerCase().includes(name.toLowerCase())
  );
}
