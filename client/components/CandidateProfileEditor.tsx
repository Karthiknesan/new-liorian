import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Save, X, Edit3, User, Mail, Phone, MapPin, Briefcase } from 'lucide-react';

interface CandidateProfile {
  id: number;
  name: string;
  email: string;
  phone: string;
  address?: string;
  course: string;
  status: string;
  enrolledAt: string;
  completionPercentage: number;
  skills?: string[];
  bio?: string;
  emergencyContact?: {
    name: string;
    phone: string;
    relationship: string;
  };
}

interface CandidateProfileEditorProps {
  profile: CandidateProfile;
  onSave: (updatedProfile: CandidateProfile) => void;
  onCancel: () => void;
  isEditing: boolean;
  canEdit: boolean; // HR/Admin can edit, candidate can only view
}

export default function CandidateProfileEditor({
  profile,
  onSave,
  onCancel,
  isEditing,
  canEdit
}: CandidateProfileEditorProps) {
  const [editedProfile, setEditedProfile] = useState<CandidateProfile>(profile);
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (field: keyof CandidateProfile, value: any) => {
    setEditedProfile(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleEmergencyContactChange = (field: string, value: string) => {
    setEditedProfile(prev => ({
      ...prev,
      emergencyContact: {
        ...prev.emergencyContact,
        [field]: value
      } as any
    }));
  };

  const handleSkillsChange = (skills: string) => {
    const skillsArray = skills.split(',').map(skill => skill.trim()).filter(skill => skill);
    setEditedProfile(prev => ({
      ...prev,
      skills: skillsArray
    }));
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      onSave(editedProfile);
    } catch (error) {
      console.error('Error saving profile:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <User className="w-5 h-5" />
          {isEditing ? 'Edit Profile' : 'Candidate Profile'}
        </CardTitle>
        {canEdit && !isEditing && (
          <Button onClick={() => onCancel()} variant="outline" size="sm">
            <Edit3 className="w-4 h-4 mr-2" />
            Edit Profile
          </Button>
        )}
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Basic Information */}
        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="flex items-center gap-2">
              <User className="w-4 h-4" />
              Full Name *
            </Label>
            {isEditing ? (
              <Input
                id="name"
                value={editedProfile.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="Enter full name"
                required
              />
            ) : (
              <div className="p-2 bg-gray-50 rounded-md">{profile.name}</div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="flex items-center gap-2">
              <Mail className="w-4 h-4" />
              Email Address *
            </Label>
            {isEditing ? (
              <Input
                id="email"
                type="email"
                value={editedProfile.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                placeholder="Enter email address"
                required
              />
            ) : (
              <div className="p-2 bg-gray-50 rounded-md">{profile.email}</div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone" className="flex items-center gap-2">
              <Phone className="w-4 h-4" />
              Phone Number *
            </Label>
            {isEditing ? (
              <Input
                id="phone"
                value={editedProfile.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                placeholder="Enter phone number"
                required
              />
            ) : (
              <div className="p-2 bg-gray-50 rounded-md">{profile.phone}</div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="address" className="flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              Address
            </Label>
            {isEditing ? (
              <Input
                id="address"
                value={editedProfile.address || ''}
                onChange={(e) => handleInputChange('address', e.target.value)}
                placeholder="Enter address"
              />
            ) : (
              <div className="p-2 bg-gray-50 rounded-md">{profile.address || 'Not provided'}</div>
            )}
          </div>
        </div>

        {/* Course Information */}
        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <Briefcase className="w-4 h-4" />
              Assigned Course
            </Label>
            <div className="p-2 bg-blue-50 border border-blue-200 rounded-md">
              {profile.course}
            </div>
          </div>

          <div className="space-y-2">
            <Label>Status</Label>
            <div className={`p-2 rounded-md ${
              profile.status === 'Active' ? 'bg-green-50 border border-green-200 text-green-800' :
              profile.status === 'In Progress' ? 'bg-yellow-50 border border-yellow-200 text-yellow-800' :
              'bg-gray-50 border border-gray-200'
            }`}>
              {profile.status}
            </div>
          </div>
        </div>

        {/* Skills */}
        <div className="space-y-2">
          <Label htmlFor="skills">Skills</Label>
          {isEditing ? (
            <Input
              id="skills"
              value={editedProfile.skills?.join(', ') || ''}
              onChange={(e) => handleSkillsChange(e.target.value)}
              placeholder="Enter skills separated by commas"
            />
          ) : (
            <div className="flex flex-wrap gap-2">
              {profile.skills && profile.skills.length > 0 ? (
                profile.skills.map((skill, index) => (
                  <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 rounded-md text-sm">
                    {skill}
                  </span>
                ))
              ) : (
                <div className="p-2 bg-gray-50 rounded-md text-gray-500">No skills listed</div>
              )}
            </div>
          )}
        </div>

        {/* Bio */}
        <div className="space-y-2">
          <Label htmlFor="bio">Bio</Label>
          {isEditing ? (
            <Textarea
              id="bio"
              value={editedProfile.bio || ''}
              onChange={(e) => handleInputChange('bio', e.target.value)}
              placeholder="Write a brief bio..."
              rows={3}
            />
          ) : (
            <div className="p-2 bg-gray-50 rounded-md min-h-[60px]">
              {profile.bio || 'No bio provided'}
            </div>
          )}
        </div>

        {/* Emergency Contact */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Emergency Contact</h3>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="emergency-name">Contact Name</Label>
              {isEditing ? (
                <Input
                  id="emergency-name"
                  value={editedProfile.emergencyContact?.name || ''}
                  onChange={(e) => handleEmergencyContactChange('name', e.target.value)}
                  placeholder="Emergency contact name"
                />
              ) : (
                <div className="p-2 bg-gray-50 rounded-md">
                  {profile.emergencyContact?.name || 'Not provided'}
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="emergency-phone">Contact Phone</Label>
              {isEditing ? (
                <Input
                  id="emergency-phone"
                  value={editedProfile.emergencyContact?.phone || ''}
                  onChange={(e) => handleEmergencyContactChange('phone', e.target.value)}
                  placeholder="Emergency contact phone"
                />
              ) : (
                <div className="p-2 bg-gray-50 rounded-md">
                  {profile.emergencyContact?.phone || 'Not provided'}
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="emergency-relationship">Relationship</Label>
              {isEditing ? (
                <Input
                  id="emergency-relationship"
                  value={editedProfile.emergencyContact?.relationship || ''}
                  onChange={(e) => handleEmergencyContactChange('relationship', e.target.value)}
                  placeholder="Relationship"
                />
              ) : (
                <div className="p-2 bg-gray-50 rounded-md">
                  {profile.emergencyContact?.relationship || 'Not provided'}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Progress Information */}
        <div className="space-y-2">
          <Label>Course Progress</Label>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Completion</span>
              <span>{profile.completionPercentage}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${profile.completionPercentage}%` }}
              ></div>
            </div>
            <div className="text-sm text-gray-600">
              Enrolled: {new Date(profile.enrolledAt).toLocaleDateString()}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        {isEditing && canEdit && (
          <div className="flex gap-3 pt-4 border-t">
            <Button 
              onClick={handleSave} 
              disabled={isLoading}
              className="flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              {isLoading ? 'Saving...' : 'Save Changes'}
            </Button>
            <Button 
              onClick={onCancel} 
              variant="outline"
              className="flex items-center gap-2"
            >
              <X className="w-4 h-4" />
              Cancel
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
