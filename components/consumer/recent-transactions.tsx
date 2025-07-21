"use client"

import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDate } from "@/lib/utils";

interface Transaction {
  id: number;
  amount: number;
  type: string;
  date: string;
  description?: string;
  pointsEarned?: number;
}

export function RecentTransactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      const token = localStorage.getItem("token");
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      const userId = user.id;

      if (!token || !userId) {
        console.error("Authentication token or user ID not found.");
        setLoading(false);
        return;
      }

      const response = await fetch(
        `http://localhost:5000/api/transaction?userId=${userId}&limit=10`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch transactions: ${response.statusText}`);
      }

      const data = await response.json();
      setTransactions(data.transactions);
    } catch (error) {
      console.error("Error fetching transactions:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatAmount = (amount: number, type: string) => {
    if (type === "purchase") {
      return `-₹${amount.toFixed(2)}`;
    } else if (type === "points_earned") {
      return `+${amount} points`;
    }
    return `₹${amount.toFixed(2)}`;
  };

  const getTransactionLabel = (type: string) => {
    switch (type) {
      case "purchase":
        return "Purchase";
      case "points_earned":
        return "Points Earned";
      case "reward":
        return "Reward Redemption";
      default:
        return type.charAt(0).toUpperCase() + type.slice(1);
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Transactions</CardTitle>
        </CardHeader>
        <CardContent>Loading transactions...</CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Transactions</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Points</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transactions.map((transaction) => (
              <TableRow key={transaction.id}>
                <TableCell>{formatDate(transaction.date)}</TableCell>
                <TableCell>{getTransactionLabel(transaction.type)}</TableCell>
                <TableCell>
                  {transaction.type === "points_earned"
                    ? "-"
                    : formatAmount(transaction.amount, transaction.type)}
                </TableCell>
                <TableCell>
                  {transaction.type === "points_earned"
                    ? `+${transaction.amount}`
                    : transaction.pointsEarned
                    ? `+${transaction.pointsEarned}`
                    : "-"}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
