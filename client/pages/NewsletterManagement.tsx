import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { useNavigate } from 'react-router-dom';
import { 
  Mail, 
  Users, 
  Send, 
  Download, 
  Trash2, 
  Plus, 
  Eye, 
  BarChart, 
  Calendar,
  ArrowLeft
} from 'lucide-react';
import SimpleAuth from '../utils/simpleAuth';
import DashboardNavigation from '../components/DashboardNavigation';
import type { FC } from 'react';

interface Subscriber {
  id: string;
  email: string;
  subscribedAt: string;
  isActive: boolean;
  offers: boolean;
  source: string;
}

interface NewsletterStats {
  total: number;
  withOffers: number;
  sources: Record<string, number>;
}

const NewsletterManagement: FC = () => {
  const navigate = useNavigate();
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [stats, setStats] = useState<NewsletterStats>({ total: 0, withOffers: 0, sources: {} });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // Send offer form
  const [showSendOfferForm, setShowSendOfferForm] = useState(false);
  const [sendingOffer, setSendingOffer] = useState(false);
  const [offerForm, setOfferForm] = useState({
    subject: '',
    content: '',
    recipients: [] as string[]
  });

  const auth = SimpleAuth.getInstance();

  useEffect(() => {
    // Check authentication
    if (!auth.isAuthenticated()) {
      navigate('/login');
      return;
    }

    const userType = auth.getUserType();
    if (userType !== 'admin') {
      navigate('/admin-dashboard');
      return;
    }

    loadSubscribers();
  }, []);

  const loadSubscribers = async () => {
    try {
      setLoading(true);
      const token = authManager.getToken();
      
      const response = await fetch('/api/admin/newsletter/subscribers', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to load subscribers');
      }

      const data = await response.json();
      setSubscribers(data.subscribers || []);
      setStats(data.stats || { total: 0, withOffers: 0, sources: {} });
      setError('');
    } catch (err: any) {
      setError(err.message || 'Failed to load subscribers');
    } finally {
      setLoading(false);
    }
  };

  const handleSendOffer = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!offerForm.subject.trim() || !offerForm.content.trim()) {
      setError('Subject and content are required');
      return;
    }

    try {
      setSendingOffer(true);
      setError('');
      
      const token = authManager.getToken();
      const response = await fetch('/api/admin/newsletter/send-offer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(offerForm)
      });

      if (!response.ok) {
        throw new Error('Failed to send offer');
      }

      const data = await response.json();
      setSuccess(`Newsletter sent to ${data.sentTo} subscribers!`);
      setShowSendOfferForm(false);
      setOfferForm({ subject: '', content: '', recipients: [] });
      
      // Clear success message after 5 seconds
      setTimeout(() => setSuccess(''), 5000);
      
    } catch (err: any) {
      setError(err.message || 'Failed to send offer');
    } finally {
      setSendingOffer(false);
    }
  };

  const handleDeleteSubscriber = async (email: string) => {
    if (!confirm(`Are you sure you want to delete subscriber: ${email}?`)) {
      return;
    }

    try {
      const token = authManager.getToken();
      const response = await fetch(`/api/admin/newsletter/subscribers/${encodeURIComponent(email)}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to delete subscriber');
      }

      setSuccess('Subscriber deleted successfully');
      loadSubscribers();
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(''), 3000);
      
    } catch (err: any) {
      setError(err.message || 'Failed to delete subscriber');
    }
  };

  const handleExportSubscribers = async () => {
    try {
      const token = authManager.getToken();
      const response = await fetch('/api/admin/newsletter/export', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to export subscribers');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `newsletter-subscribers-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      setSuccess('Subscribers exported successfully');
      setTimeout(() => setSuccess(''), 3000);
      
    } catch (err: any) {
      setError(err.message || 'Failed to export subscribers');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <>
      <DashboardNavigation
        userType="admin"
        userName="Administrator"
        showSearchModal={() => {}}
      />
      
      <div className="min-h-screen bg-gray-50 pt-20">
        <div className="max-w-7xl mx-auto px-4 py-8">
          
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <Button 
                variant="outline" 
                onClick={() => navigate('/admin-dashboard')}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Dashboard
              </Button>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                  <Mail className="w-8 h-8 text-blue-600" />
                  Newsletter Management
                </h1>
                <p className="text-gray-600">Manage subscribers and send offers</p>
              </div>
            </div>
            
            <div className="flex gap-3">
              <Button 
                onClick={handleExportSubscribers}
                variant="outline"
                className="flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                Export CSV
              </Button>
              <Button 
                onClick={() => setShowSendOfferForm(true)}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
              >
                <Send className="w-4 h-4" />
                Send Offer
              </Button>
            </div>
          </div>

          {/* Error/Success Messages */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-800">
              {error}
            </div>
          )}
          
          {success && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg text-green-800">
              {success}
            </div>
          )}

          {/* Stats Cards */}
          <div className="grid md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Total Subscribers</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                  </div>
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <Users className="w-5 h-5 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Offer Subscribers</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.withOffers}</p>
                  </div>
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <Mail className="w-5 h-5 text-green-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Conversion Rate</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {stats.total > 0 ? Math.round((stats.withOffers / stats.total) * 100) : 0}%
                    </p>
                  </div>
                  <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                    <BarChart className="w-5 h-5 text-purple-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">This Month</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {subscribers.filter(sub => {
                        const subDate = new Date(sub.subscribedAt);
                        const thisMonth = new Date();
                        return subDate.getMonth() === thisMonth.getMonth() && 
                               subDate.getFullYear() === thisMonth.getFullYear();
                      }).length}
                    </p>
                  </div>
                  <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-orange-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Send Offer Modal */}
          {showSendOfferForm && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <Card className="w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Send className="w-5 h-5" />
                    Send Newsletter/Offer
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSendOffer} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Subject
                      </label>
                      <Input
                        type="text"
                        value={offerForm.subject}
                        onChange={(e) => setOfferForm(prev => ({ ...prev, subject: e.target.value }))}
                        placeholder="Enter email subject"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Content
                      </label>
                      <Textarea
                        value={offerForm.content}
                        onChange={(e) => setOfferForm(prev => ({ ...prev, content: e.target.value }))}
                        placeholder="Enter email content..."
                        rows={6}
                        required
                      />
                    </div>
                    
                    <div className="text-sm text-gray-600">
                      <p>📧 Will send to {stats.withOffers} subscribers who opted in for offers</p>
                    </div>
                    
                    <div className="flex gap-3 pt-4">
                      <Button 
                        type="submit" 
                        disabled={sendingOffer}
                        className="flex items-center gap-2"
                      >
                        <Send className="w-4 h-4" />
                        {sendingOffer ? 'Sending...' : 'Send Newsletter'}
                      </Button>
                      <Button 
                        type="button" 
                        variant="outline"
                        onClick={() => setShowSendOfferForm(false)}
                      >
                        Cancel
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Subscribers List */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="w-5 h-5" />
                Subscribers ({stats.total})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                  <p className="text-gray-600 mt-2">Loading subscribers...</p>
                </div>
              ) : subscribers.length === 0 ? (
                <div className="text-center py-8">
                  <Mail className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">No subscribers yet</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 px-4 font-medium text-gray-700">Email</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-700">Subscribed</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-700">Offers</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-700">Source</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-700">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {subscribers.map((subscriber) => (
                        <tr key={subscriber.id} className="border-b hover:bg-gray-50">
                          <td className="py-3 px-4">{subscriber.email}</td>
                          <td className="py-3 px-4 text-sm text-gray-600">
                            {formatDate(subscriber.subscribedAt)}
                          </td>
                          <td className="py-3 px-4">
                            <Badge variant={subscriber.offers ? "default" : "secondary"}>
                              {subscriber.offers ? "Yes" : "No"}
                            </Badge>
                          </td>
                          <td className="py-3 px-4">
                            <Badge variant="outline">{subscriber.source}</Badge>
                          </td>
                          <td className="py-3 px-4">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleDeleteSubscriber(subscriber.email)}
                              className="text-red-600 hover:text-red-700 hover:bg-red-50"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
};

export default NewsletterManagement;
