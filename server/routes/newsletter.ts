import { RequestHandler } from "express";
import { z } from "zod";

// Newsletter subscription data storage (in production, use a database)
interface NewsletterSubscriber {
  id: string;
  email: string;
  subscribedAt: string;
  isActive: boolean;
  offers: boolean;
  source: string;
}

// In-memory storage (replace with database in production)
let subscribers: NewsletterSubscriber[] = [];

// Validation schemas
const subscribeSchema = z.object({
  email: z.string().email("Invalid email address"),
  offers: z.boolean().optional().default(true),
  source: z.string().optional().default("website")
});

const sendOfferSchema = z.object({
  subject: z.string().min(1, "Subject is required"),
  content: z.string().min(1, "Content is required"),
  recipients: z.array(z.string()).optional(), // If empty, send to all
});

// Subscribe to newsletter
export const handleNewsletterSubscribe: RequestHandler = (req, res) => {
  try {
    console.log('📧 Newsletter subscription request:', req.body);
    
    const validation = subscribeSchema.safeParse(req.body);
    
    if (!validation.success) {
      return res.status(400).json({
        success: false,
        message: "Invalid data",
        errors: validation.error.issues
      });
    }
    
    const { email, offers, source } = validation.data;
    
    // Check if email already exists
    const existingSubscriber = subscribers.find(sub => sub.email === email);
    if (existingSubscriber) {
      if (existingSubscriber.isActive) {
        return res.status(409).json({
          success: false,
          message: "Email already subscribed"
        });
      } else {
        // Reactivate existing subscriber
        existingSubscriber.isActive = true;
        existingSubscriber.subscribedAt = new Date().toISOString();
        console.log('✅ Reactivated subscriber:', email);
        
        return res.json({
          success: true,
          message: "Successfully resubscribed to newsletter!"
        });
      }
    }
    
    // Create new subscriber
    const newSubscriber: NewsletterSubscriber = {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      email,
      subscribedAt: new Date().toISOString(),
      isActive: true,
      offers,
      source
    };
    
    subscribers.push(newSubscriber);
    console.log('✅ New subscriber added:', email);
    
    res.json({
      success: true,
      message: "Successfully subscribed to newsletter!"
    });
    
  } catch (error) {
    console.error('❌ Newsletter subscription error:', error);
    res.status(500).json({
      success: false,
      message: "Failed to subscribe. Please try again."
    });
  }
};

// Get all subscribers (admin only)
export const handleGetSubscribers: RequestHandler = (req, res) => {
  try {
    console.log('📋 Fetching newsletter subscribers');
    
    const activeSubscribers = subscribers.filter(sub => sub.isActive);
    
    res.json({
      success: true,
      subscribers: activeSubscribers,
      total: activeSubscribers.length,
      stats: {
        total: activeSubscribers.length,
        withOffers: activeSubscribers.filter(sub => sub.offers).length,
        sources: activeSubscribers.reduce((acc, sub) => {
          acc[sub.source] = (acc[sub.source] || 0) + 1;
          return acc;
        }, {} as Record<string, number>)
      }
    });
    
  } catch (error) {
    console.error('❌ Error fetching subscribers:', error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch subscribers"
    });
  }
};

// Unsubscribe from newsletter
export const handleNewsletterUnsubscribe: RequestHandler = (req, res) => {
  try {
    const { email } = req.params;
    console.log('🚫 Unsubscribe request for:', email);
    
    const subscriber = subscribers.find(sub => sub.email === email);
    if (!subscriber) {
      return res.status(404).json({
        success: false,
        message: "Email not found in subscribers"
      });
    }
    
    subscriber.isActive = false;
    console.log('✅ Subscriber unsubscribed:', email);
    
    res.json({
      success: true,
      message: "Successfully unsubscribed from newsletter"
    });
    
  } catch (error) {
    console.error('❌ Unsubscribe error:', error);
    res.status(500).json({
      success: false,
      message: "Failed to unsubscribe"
    });
  }
};

// Send offer/newsletter (admin only)
export const handleSendOffer: RequestHandler = (req, res) => {
  try {
    console.log('📨 Sending newsletter/offer:', req.body);
    
    const validation = sendOfferSchema.safeParse(req.body);
    
    if (!validation.success) {
      return res.status(400).json({
        success: false,
        message: "Invalid data",
        errors: validation.error.issues
      });
    }
    
    const { subject, content, recipients } = validation.data;
    
    // Get target recipients
    let targetRecipients: string[];
    
    if (recipients && recipients.length > 0) {
      // Send to specific recipients
      targetRecipients = recipients.filter(email => 
        subscribers.find(sub => sub.email === email && sub.isActive)
      );
    } else {
      // Send to all active subscribers who opted in for offers
      targetRecipients = subscribers
        .filter(sub => sub.isActive && sub.offers)
        .map(sub => sub.email);
    }
    
    if (targetRecipients.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No valid recipients found"
      });
    }
    
    // In production, integrate with email service (SendGrid, Mailgun, etc.)
    console.log('📧 Simulating email send to:', targetRecipients.length, 'recipients');
    console.log('📧 Subject:', subject);
    console.log('📧 Content preview:', content.substring(0, 100) + '...');
    
    // Simulate email sending delay
    setTimeout(() => {
      console.log('✅ Newsletter/offer sent successfully');
    }, 1000);
    
    res.json({
      success: true,
      message: `Newsletter sent to ${targetRecipients.length} subscribers`,
      sentTo: targetRecipients.length,
      recipients: targetRecipients
    });
    
  } catch (error) {
    console.error('❌ Send offer error:', error);
    res.status(500).json({
      success: false,
      message: "Failed to send newsletter"
    });
  }
};

// Delete subscriber (admin only)
export const handleDeleteSubscriber: RequestHandler = (req, res) => {
  try {
    const { email } = req.params;
    console.log('🗑️ Delete subscriber request for:', email);
    
    const index = subscribers.findIndex(sub => sub.email === email);
    if (index === -1) {
      return res.status(404).json({
        success: false,
        message: "Subscriber not found"
      });
    }
    
    subscribers.splice(index, 1);
    console.log('✅ Subscriber deleted:', email);
    
    res.json({
      success: true,
      message: "Subscriber deleted successfully"
    });
    
  } catch (error) {
    console.error('❌ Delete subscriber error:', error);
    res.status(500).json({
      success: false,
      message: "Failed to delete subscriber"
    });
  }
};

// Export subscriber data (admin only)
export const handleExportSubscribers: RequestHandler = (req, res) => {
  try {
    console.log('📤 Exporting subscriber data');
    
    const activeSubscribers = subscribers.filter(sub => sub.isActive);
    
    // Convert to CSV format
    const csvHeader = "Email,Subscribed At,Offers,Source\n";
    const csvData = activeSubscribers
      .map(sub => `${sub.email},${sub.subscribedAt},${sub.offers},${sub.source}`)
      .join('\n');
    
    const csv = csvHeader + csvData;
    
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="newsletter-subscribers.csv"');
    res.send(csv);
    
  } catch (error) {
    console.error('❌ Export error:', error);
    res.status(500).json({
      success: false,
      message: "Failed to export subscribers"
    });
  }
};
