import { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Layout } from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Edit, Trash2, Search, Filter } from 'lucide-react';
import { format } from 'date-fns';

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

const categories = {
  expense: ['Food', 'Rent', 'Shopping', 'Transportation', 'Entertainment', 'Healthcare', 'Utilities', 'Other'],
  income: ['Salary', 'Freelance', 'Investment', 'Business', 'Gift', 'Other'],
};

export default function ViewEntries() {
  const { user } = useAuth();
  const [entries, setEntries] = useState<FinanceEntry[]>([]);
  const [filteredEntries, setFilteredEntries] = useState<FinanceEntry[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterType, setFilterType] = useState('all');
  const [editingEntry, setEditingEntry] = useState<FinanceEntry | null>(null);
  const [editForm, setEditForm] = useState({
    title: '',
    amount: '',
    category: '',
    notes: '',
  });

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  useEffect(() => {
    fetchEntries();
  }, [user]);

  useEffect(() => {
    filterEntries();
  }, [entries, searchTerm, filterCategory, filterType]);

  const fetchEntries = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from('finance_entries')
      .select('*')
      .eq('user_id', user.id)
      .order('date', { ascending: false });

    if (error) {
      console.error('Error fetching entries:', error);
      return;
    }

    setEntries(data || []);
  };

  const filterEntries = () => {
    let filtered = entries;

    if (searchTerm) {
      filtered = filtered.filter(entry =>
        entry.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        entry.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filterCategory !== 'all') {
      filtered = filtered.filter(entry => entry.category === filterCategory);
    }

    if (filterType !== 'all') {
      filtered = filtered.filter(entry => entry.type === filterType);
    }

    setFilteredEntries(filtered);
  };

  const handleEdit = (entry: FinanceEntry) => {
    setEditingEntry(entry);
    setEditForm({
      title: entry.title,
      amount: entry.amount.toString(),
      category: entry.category,
      notes: entry.notes || '',
    });
  };

  const handleSaveEdit = async () => {
    if (!editingEntry) return;

    const { error } = await supabase
      .from('finance_entries')
      .update({
        title: editForm.title,
        amount: parseFloat(editForm.amount),
        category: editForm.category,
        notes: editForm.notes || null,
      })
      .eq('id', editingEntry.id);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to update entry.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Success",
      description: "Entry updated successfully.",
    });

    setEditingEntry(null);
    fetchEntries();
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase
      .from('finance_entries')
      .delete()
      .eq('id', id);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to delete entry.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Success",
      description: "Entry deleted successfully.",
    });

    fetchEntries();
  };

  const formatCurrency = (amount: number) => {
    return `₹${amount.toLocaleString('en-IN')}`;
  };

  const getAllCategories = () => {
    const allCategories = [...categories.income, ...categories.expense];
    return [...new Set(allCategories)].sort();
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-foreground">View Entries</h1>
        </div>

        {/* Search and Filters */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Search & Filter
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Search</Label>
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by title or category..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-8"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>Filter by Type</Label>
                <Select value={filterType} onValueChange={setFilterType}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="income">Income</SelectItem>
                    <SelectItem value="expense">Expense</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Filter by Category</Label>
                <Select value={filterCategory} onValueChange={setFilterCategory}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {getAllCategories().map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Entries Table */}
        <Card>
          <CardHeader>
            <CardTitle>Entries ({filteredEntries.length})</CardTitle>
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
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredEntries.map((entry) => (
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
                    <TableCell>
                      <div className="flex space-x-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEdit(entry)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="sm:max-w-[425px]">
                            <DialogHeader>
                              <DialogTitle>Edit Entry</DialogTitle>
                              <DialogDescription>
                                Make changes to your entry here.
                              </DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                              <div className="space-y-2">
                                <Label htmlFor="edit-title">Title</Label>
                                <Input
                                  id="edit-title"
                                  value={editForm.title}
                                  onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                                />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="edit-amount">Amount</Label>
                                <Input
                                  id="edit-amount"
                                  type="number"
                                  step="0.01"
                                  value={editForm.amount}
                                  onChange={(e) => setEditForm({ ...editForm, amount: e.target.value })}
                                />
                              </div>
                              <div className="space-y-2">
                                <Label>Category</Label>
                                <Select
                                  value={editForm.category}
                                  onValueChange={(value) => setEditForm({ ...editForm, category: value })}
                                >
                                  <SelectTrigger>
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {getAllCategories().map((category) => (
                                      <SelectItem key={category} value={category}>
                                        {category}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="edit-notes">Notes</Label>
                                <Textarea
                                  id="edit-notes"
                                  value={editForm.notes}
                                  onChange={(e) => setEditForm({ ...editForm, notes: e.target.value })}
                                />
                              </div>
                            </div>
                            <DialogFooter>
                              <Button onClick={handleSaveEdit}>Save changes</Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>

                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="outline" size="sm">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                              <AlertDialogDescription>
                                This action cannot be undone. This will permanently delete this entry.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction onClick={() => handleDelete(entry.id)}>
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            
            {filteredEntries.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                No entries found matching your criteria.
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}