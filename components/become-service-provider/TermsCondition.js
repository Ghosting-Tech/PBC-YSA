import React from "react";
import {
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
} from "@material-tailwind/react";
import { Button } from "@material-tailwind/react";
import { ScrollArea } from "@material-tailwind/react";
import { FaRegFileAlt } from "react-icons/fa";

const TermsCondition = ({ isOpen, onClose, onAccept }) => {
  return (
    <Dialog
      open={isOpen}
      handler={onClose}
      size="xl"
      className="max-w-lg mx-auto p-4 bg-white shadow-lg rounded-lg"
    >
      <DialogHeader className="flex items-center gap-3 border-b pb-2">
        <FaRegFileAlt className="text-blue-500" size={28} />
        <h3 className="text-lg font-semibold text-gray-800">
          Terms and Conditions
        </h3>
      </DialogHeader>
      <DialogBody divider className="overflow-auto max-h-[70vh] p-4">
        <section className="mb-4">
          <h4 className="text-md font-bold text-gray-700 mb-2">
            Eligibility Criteria for Nursing Partners:
          </h4>
          <ul className="text-sm text-gray-600 list-disc ml-5">
            <li>
              <strong>Experience:</strong> Minimum 1 year of professional
              experience in a hospital, ICU ward, or nursing home.
            </li>
            <li>
              <strong>Required Documents:</strong>
              <ul className="list-circle ml-5 mt-1">
                <li>Updated CV (Curriculum Vitae).</li>
                <li>Aadhar Card (or equivalent valid identification).</li>
              </ul>
            </li>
            <li>
              <strong>Skills and Expertise:</strong>
              Proficiency in:
              <ul className="list-disc ml-5 mt-1">
                <li>
                  Intravenous, Intramuscular, and Subcutaneous injections.
                </li>
                <li>Foly’s and Ryl’s tube insertion, removal, and care.</li>
                <li>Ryl’s tube (RT) feeding.</li>
                <li>Tracheostomy care and suction.</li>
                <li>Medication administration and patient care.</li>
                <li>General patient care.</li>
                <li>Operation of BiPAP machines.</li>
                <li>Vital monitoring.</li>
              </ul>
            </li>
          </ul>
        </section>

        <section className="mb-4">
          <h4 className="text-md font-bold text-gray-700 mb-2">
            General Terms and Conditions:
          </h4>
          <ul className="text-sm text-gray-600 list-disc ml-5">
            <li>
              <strong>Professional Behavior:</strong> Service providers must
              treat patients, families, and users with respect, dignity, and
              compassion.
            </li>
            <li>
              <strong>Prohibition of Misconduct:</strong> Misbehavior, abuse,
              harassment, or intoxication during service hours is strictly
              prohibited.
            </li>
            <li>
              <strong>Safe Practices:</strong> Ensure patient safety at all
              times; driving under the influence is forbidden.
            </li>
            <li>
              <strong>Compliance with Policies:</strong> Adhere to all Hwhcare
              policies and guidelines.
            </li>
          </ul>
        </section>

        <section>
          <h4 className="text-md font-bold text-gray-700 mb-2">
            Termination Clause:
          </h4>
          <p className="text-sm text-gray-600">
            Hwhcare reserves the right to terminate services without prior
            notice in cases of misconduct, policy violations, or breach of
            terms.
          </p>
        </section>
        <div className="flex justify-end gap-4 pt-2">
          <Button
            variant="outlined"
            color="red"
            onClick={onClose}
            className="border-red-500 text-red-500 hover:bg-red-100"
          >
            Decline
          </Button>
          <Button
            color="blue"
            onClick={onAccept}
            className="bg-blue-500 text-white hover:bg-blue-600"
          >
            Accept
          </Button>
        </div>
      </DialogBody>
    </Dialog>
  );
};

export default TermsCondition;
