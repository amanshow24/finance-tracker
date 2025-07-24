import { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Layout } from '@/components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { Download, TrendingUp, TrendingDown, Wallet } from 'lucide-react';
import { format } from 'date-fns';
import { CSVLink } from 'react-csv';

interface FinanceEntry {
  id: string;
  type: string;
  title: string;
  amount: number;
  category: string;
  date: string;
  notes: string | null;
  created_at: string;
  user_id: string;
}

interface MonthlySummary {
  month: string;
  totalIncome: number;
  totalExpense: number;
  netSavings: number;
  transactionCount: number;
}

export default function Reports() {
  const { user } = useAuth();
  const [entries, setEntries] = useState<FinanceEntry[]>([]);
  const [selectedMonth, setSelectedMonth] = useState(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  });
  const [monthlySummary, setMonthlySummary] = useState<MonthlySummary | null>(null);
  const [csvData, setCsvData] = useState<any[]>([]);

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  useEffect(() => {
    fetchEntries();
  }, [selectedMonth, user]);

  useEffect(() => {
    if (entries.length > 0) {
      calculateMonthlySummary();
      prepareCsvData();
    }
  }, [entries, selectedMonth]);

  const fetchEntries = async () => {
    if (!user) return;

    const startDate = `${selectedMonth}-01`;
    const endDate = `${selectedMonth}-31`;

    const { data, error } = await supabase
      .from('finance_entries')
      .select('*')
      .eq('user_id', user.id)
      .gte('date', startDate)
      .lte('date', endDate)
      .order('date', { ascending: false });

    if (error) {
      console.error('Error fetching entries:', error);
      return;
    }

    setEntries(data || []);
  };

  const calculateMonthlySummary = () => {
    const totalIncome = entries
      .filter(entry => entry.type === 'income')
      .reduce((sum, entry) => sum + Number(entry.amount), 0);
    
    const totalExpense = entries
      .filter(entry => entry.type === 'expense')
      .reduce((sum, entry) => sum + Number(entry.amount), 0);

    const monthName = new Date(`${selectedMonth}-01`).toLocaleDateString('en-US', { 
      month: 'long', 
      year: 'numeric' 
    });

    setMonthlySummary({
      month: monthName,
      totalIncome,
      totalExpense,
      netSavings: totalIncome - totalExpense,
      transactionCount: entries.length,
    });
  };

  const prepareCsvData = () => {
    const csvEntries = entries.map(entry => ({
      Date: format(new Date(entry.date), 'yyyy-MM-dd'),
      Title: entry.title,
      Type: entry.type,
      Category: entry.category,
      Amount: entry.amount,
      Notes: entry.notes || '',
      'Created At': format(new Date(entry.created_at), 'yyyy-MM-dd HH:mm:ss'),
    }));

    setCsvData(csvEntries);
  };

  const formatCurrency = (amount: number) => {
    return `₹${amount.toLocaleString('en-IN')}`;
  };

  const getMonthOptions = () => {
    const options = [];
    const currentDate = new Date();
    
    for (let i = 11; i >= 0; i--) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
      const value = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      const label = date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
      options.push({ value, label });
    }
    
    return options;
  };

  const csvHeaders = [
    { label: 'Date', key: 'Date' },
    { label: 'Title', key: 'Title' },
    { label: 'Type', key: 'Type' },
    { label: 'Category', key: 'Category' },
    { label: 'Amount', key: 'Amount' },
    { label: 'Notes', key: 'Notes' },
    { label: 'Created At', key: 'Created At' },
  ];

  const csvFilename = `finance-report-${selectedMonth}.csv`;

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-foreground">Reports</h1>
          <div className="flex items-center gap-4">
            <Select value={selectedMonth} onValueChange={setSelectedMonth}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Select month" />
              </SelectTrigger>
              <SelectContent>
                {getMonthOptions().map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <CSVLink
              data={csvData}
              headers={csvHeaders}
              filename={csvFilename}
              target="_blank"
            >
              <Button variant="outline" className="flex items-center gap-2">
                <Download className="h-4 w-4" />
                Export CSV
              </Button>
            </CSVLink>
          </div>
        </div>

        {/* Monthly Summary */}
        {monthlySummary && (
          <Card>
            <CardHeader>
              <CardTitle>Monthly Summary - {monthlySummary.month}</CardTitle>
              <CardDescription>Financial overview for the selected month</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="flex items-center space-x-4">
                  <div className="p-2 bg-green-100 rounded-full">
                    <TrendingUp className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Total Income</p>
                    <p className="text-2xl font-bold text-green-600">
                      {formatCurrency(monthlySummary.totalIncome)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="p-2 bg-red-100 rounded-full">
                    <TrendingDown className="h-6 w-6 text-red-600" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Total Expenses</p>
                    <p className="text-2xl font-bold text-red-600">
                      {formatCurrency(monthlySummary.totalExpense)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="p-2 bg-blue-100 rounded-full">
                    <Wallet className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Net Savings</p>
                    <p className={`text-2xl font-bold ${monthlySummary.netSavings >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {formatCurrency(monthlySummary.netSavings)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="p-2 bg-purple-100 rounded-full">
                    <TrendingUp className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Transactions</p>
                    <p className="text-2xl font-bold text-purple-600">
                      {monthlySummary.transactionCount}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Transactions Table */}
        <Card>
          <CardHeader>
            <CardTitle>All Transactions</CardTitle>
            <CardDescription>Complete list of transactions for the selected month</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Notes</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {entries.map((entry) => (
                  <TableRow key={entry.id}>
                    <TableCell>
                      {format(new Date(entry.date), 'MMM dd, yyyy')}
                    </TableCell>
                    <TableCell className="font-medium">{entry.title}</TableCell>
                    <TableCell>
                      <Badge
                        variant={entry.type === 'income' ? 'default' : 'destructive'}
                        className={entry.type === 'income' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}
                      >
                        {entry.type}
                      </Badge>
                    </TableCell>
                    <TableCell>{entry.category}</TableCell>
                    <TableCell className={`font-medium ${entry.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                      {formatCurrency(Number(entry.amount))}
                    </TableCell>
                    <TableCell className="max-w-xs truncate">
                      {entry.notes || '-'}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            
            {entries.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                No transactions found for the selected month.
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}