"use client";

import { useEffect, useState } from "react";
import { createExpense } from "@/lib/api";

// interface Area {
//     id: number;
//     name: string;
// }

export default function DailyExpenseForm({
                                           onSuccess,
                                       }: {
    onSuccess: () => void;
}) {
    const [date, setDate] = useState("");
    const [name, setName] = useState("");
    const [expenseHead, setExpenseHead] = useState("");
    const [expenseAmount, setExpenseAmount] = useState("");
    const [cashIn, setCashIn] = useState("");
    const [cashOut, setCashOut] = useState("");
    // const [runningBalance, setRunningBalance] = useState("");
    const [remarks, setRemarks] = useState("");
    // const [openingBalance, setOpeningBalance] = useState("");
    // const [closingBalance, setClosingBalance] = useState("");
    // const [totalDeposit, setTotalDeposit] = useState("");
    // const [totalExpense, setTotalExpense] = useState("");
    // const [totalPaid, setTotalPaid] = useState("");


    const submit = async () => {
        // const dueAmount =
        //     Number(purchaseAmount) -
        //     Number(paidAmount) -
        //     Number(cashBackAmount || 0);

        await fetch("http://localhost:8080/api/daily-expenses", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                date,
                name,
                expenseHead,
                expenseAmount: Number(expenseAmount),
                cashIn: Number(cashIn),
                cashOut: Number(cashOut),
                remarks,
            }),
        });

        // reset inputs
        setDate("");
        setName("");
        setExpenseHead("");
        setExpenseAmount("");
        setCashIn("");
        setCashOut("");
        setRemarks("");
        onSuccess();
    };

    return (
        <div style={{marginBottom: 20}}>
            <h3>➕ Add Daily Expense Data</h3>

            {/*<select value={areaId} onChange={(e) => setAreaId(e.target.value)}>*/}
            {/*    <option value="">Select Area</option>*/}
            {/*    {areas.map((a) => (*/}
            {/*        <option key={a.id} value={a.id}>*/}
            {/*            {a.name}*/}
            {/*        </option>*/}
            {/*    ))}*/}
            {/*</select>*/}

            <input type="date" value={date} onChange={(e) => setDate(e.target.value)}/>
            <input placeholder="Name" value={name} onChange={(e) => setName(e.target.value)}/>
            <input placeholder="Expense Head" value={expenseHead} onChange={(e) => setExpenseHead(e.target.value)}/>

            <input type="number" placeholder="Expense Amount" value={expenseAmount}
                   onChange={(e) => setExpenseAmount(e.target.value)}/>
            <input type="number" placeholder="Cash In" value={cashIn} onChange={(e) => setCashIn(e.target.value)}/>
            <input type="number" placeholder="Cash Out" value={cashOut} onChange={(e) => setCashOut(e.target.value)}/>

            {/* calculated fields */}
            {/*<input placeholder="Running Balance (auto)" value={runningBalance} readOnly/>*/}
            {/*<input placeholder="Opening Balance (auto)" value={openingBalance} readOnly/>*/}
            {/*<input placeholder="Closing Balance (auto)" value={closingBalance} readOnly/>*/}
            {/*<input placeholder="Total Deposit (auto)" value={totalDeposit} readOnly/>*/}
            {/*<input placeholder="Total Expense (auto)" value={totalExpense} readOnly/>*/}
            {/*<input placeholder="Total Paid (auto)" value={totalPaid} readOnly/>*/}

            <input placeholder="Remarks" value={remarks} onChange={(e) => setRemarks(e.target.value)}/>

            <button onClick={submit}>Save Expense</button>
        </div>
    )
        ;
}
