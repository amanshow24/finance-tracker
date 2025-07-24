import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Mail, Github, Linkedin, Send } from 'lucide-react';

export default function Contact() {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.message) {
      toast({
        title: "Error",
        description: "Please fill in all fields.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase
        .from('contact_messages')
        .insert({
          name: formData.name,
          email: formData.email,
          message: formData.message,
        });

      if (error) {
        throw error;
      }

      toast({
        title: "Success!",
        description: "Your message has been sent successfully. We'll get back to you soon!",
      });

      // Reset form
      setFormData({
        name: '',
        email: '',
        message: '',
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to send message. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-primary text-primary-foreground py-12">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-4">Get in Touch</h1>
          <p className="text-xl opacity-90">
            Have questions or feedback? We'd love to hear from you!
          </p>
        </div>
      </div>

      {/* Contact Form */}
      <div className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12">
            <Card>
              <CardHeader>
                <CardTitle>Send us a message</CardTitle>
                <CardDescription>
                  Fill out the form below and we'll get back to you as soon as possible.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">Name *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Your full name"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="your.email@example.com"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message">Message *</Label>
                    <Textarea
                      id="message"
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Tell us what's on your mind..."
                      rows={5}
                      required
                    />
                  </div>

                  <Button type="submit" disabled={loading} className="w-full">
                    {loading ? (
                      "Sending..."
                    ) : (
                      <>
                        <Send className="mr-2 h-4 w-4" />
                        Send Message
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>

            <div className="space-y-8">
              <Card>
                <CardHeader>
                  <CardTitle>Contact Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center space-x-4">
                    <div className="p-2 bg-primary/10 rounded-full">
                      <Mail className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">Email</p>
                      <p className="text-muted-foreground">amanshow9800@gmail.com</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    <div className="p-2 bg-primary/10 rounded-full">
                      <Github className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">GitHub</p>
                      <p className="text-muted-foreground">github.com/amanshow24</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    <div className="p-2 bg-primary/10 rounded-full">
                      <Linkedin className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">LinkedIn</p>
                      <p className="text-muted-foreground">linkedin.com/in/aman-kumar-show-a5589b290/</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Frequently Asked Questions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">How secure is my financial data?</h4>
                    <p className="text-sm text-muted-foreground">
                      We use industry-standard encryption and security measures to protect your data. Your information is stored securely and never shared with third parties.
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-2">Can I export my data?</h4>
                    <p className="text-sm text-muted-foreground">
                      Yes! You can export your financial data as CSV files from the Reports page for your records or analysis.
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-2">Is there a mobile app?</h4>
                    <p className="text-sm text-muted-foreground">
                      Currently, we offer a responsive web application that works great on mobile devices. A dedicated mobile app is in development.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-muted py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-6 md:mb-0">
              <h3 className="text-xl font-bold text-foreground mb-2">Finance Tracker</h3>
              <p className="text-muted-foreground">© 2025 Finance Tracker. All rights reserved.</p>
            </div>
            <div className="flex flex-wrap gap-6">
              <a href="/" className="text-muted-foreground hover:text-foreground">Home</a>
              <a href="/contact" className="text-muted-foreground hover:text-foreground">Contact</a>
              <a href="/contact" className="text-muted-foreground hover:text-foreground">Privacy</a>
              <a href="/contact" className="text-muted-foreground hover:text-foreground">Terms</a>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-border flex justify-center space-x-6">
            <a href="https://github.com/amanshow24" className="text-muted-foreground hover:text-foreground">
              <Github className="h-5 w-5" />
            </a>
            <a href="https://www.linkedin.com/in/aman-kumar-show-a5589b290" className="text-muted-foreground hover:text-foreground">
              <Linkedin className="h-5 w-5" />
            </a>
            <a href="malito:amanshow9800@gmail.com" className="text-muted-foreground hover:text-foreground">
              <Mail className="h-5 w-5" />
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}