import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, PieChart, Shield, DollarSign, BarChart3, Calculator } from 'lucide-react';

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="flex items-center justify-center min-h-[70vh] px-4">
        <div className="text-center max-w-4xl">
          <h1 className="text-5xl font-bold mb-6 text-foreground">
            Track your finances, <span className="text-primary">stress-free</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Take control of your financial future with our easy-to-use expense tracker. 
            Monitor income, expenses, and savings all in one place.
          </p>
          <Link to="/auth">
            <Button size="lg" className="px-8 py-6 text-lg">
              Get Started
            </Button>
          </Link>
        </div>
      </div>

      {/* Benefits Section */}
      <div className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 text-foreground">
            Why Choose Our Finance Tracker?
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card>
              <CardHeader className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-primary/10 rounded-full flex items-center justify-center">
                  <TrendingUp className="w-8 h-8 text-primary" />
                </div>
                <CardTitle>Smart Analytics</CardTitle>
                <CardDescription>
                  Get insights into your spending patterns with detailed charts and reports
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-primary/10 rounded-full flex items-center justify-center">
                  <Shield className="w-8 h-8 text-primary" />
                </div>
                <CardTitle>Secure & Private</CardTitle>
                <CardDescription>
                  Your financial data is encrypted and stored securely with industry-standard protection
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-primary/10 rounded-full flex items-center justify-center">
                  <Calculator className="w-8 h-8 text-primary" />
                </div>
                <CardTitle>Easy to Use</CardTitle>
                <CardDescription>
                  Simple interface makes tracking expenses effortless, even for beginners
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-muted py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-6 md:mb-0">
              <h3 className="text-xl font-bold text-foreground mb-2">Finance Tracker</h3>
              <p className="text-muted-foreground">© 2024 Finance Tracker. All rights reserved.</p>
            </div>
            <div className="flex flex-wrap gap-6">
              <Link to="/" className="text-muted-foreground hover:text-foreground">Home</Link>
              <Link to="/contact" className="text-muted-foreground hover:text-foreground">Contact</Link>
              <a href="#" className="text-muted-foreground hover:text-foreground">Privacy</a>
              <a href="#" className="text-muted-foreground hover:text-foreground">Terms</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
