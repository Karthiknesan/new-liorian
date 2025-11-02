import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import SimpleAuth from '../utils/simpleAuth';
import BlogDataManager from '../utils/blogDataManager';
import DashboardNavigation from '../components/DashboardNavigation';
import { Plus, Edit, Trash2, Eye, EyeOff, Users, Save, X, AlertCircle } from 'lucide-react';
import type { BlogPost } from '../utils/blogDataManager';

export default function BlogAdminManagement() {
  const navigate = useNavigate();
  const auth = SimpleAuth.getInstance();
  const blogManager = BlogDataManager.getInstance();

  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showStaffModal, setShowStaffModal] = useState(false);
  const [selectedBlog, setSelectedBlog] = useState<BlogPost | null>(null);
  const [formData, setFormData] = useState<Partial<BlogPost>>({
    title: '',
    excerpt: '',
    content: '',
    author: '',
    category: '',
    image: '',
    tags: [],
    featured: false,
    published: false,
    readTime: '5 min read',
    readingLevel: 'Beginner'
  });
  const [staffList, setStaffList] = useState<Array<{ id: string; name: string }>>([]);
  const [selectedStaffForAssignment, setSelectedStaffForAssignment] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'published' | 'draft'>('all');

  // Authentication check
  useEffect(() => {
    if (!auth.isAuthenticated()) {
      navigate('/login');
      return;
    }

    const user = auth.getCurrentUser();
    if (user?.role !== 'admin') {
      navigate('/admin-dashboard');
      return;
    }
  }, [navigate]);

  // Load blogs
  useEffect(() => {
    const allBlogs = blogManager.getAllBlogs();
    setBlogs(allBlogs);

    // Load sample staff list (in production, fetch from API)
    setStaffList([
      { id: 'staff1', name: 'John Trainer' },
      { id: 'staff2', name: 'Sarah Coach' },
      { id: 'staff3', name: 'Mike Mentor' }
    ]);

    const unsubscribe = blogManager.subscribe((updatedBlogs) => {
      setBlogs(updatedBlogs);
    });

    return unsubscribe;
  }, []);

  const filteredBlogs = blogs.filter(blog => {
    const matchesSearch = searchQuery.toLowerCase() === '' || 
      blog.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      blog.category.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = filterStatus === 'all' || 
      (filterStatus === 'published' && blog.published) ||
      (filterStatus === 'draft' && !blog.published);

    return matchesSearch && matchesStatus;
  });

  const handleCreateBlog = () => {
    if (!formData.title || !formData.excerpt || !formData.content || !formData.category) {
      alert('Please fill all required fields');
      return;
    }

    const newBlog = blogManager.createBlog({
      title: formData.title || '',
      excerpt: formData.excerpt || '',
      content: formData.content || '',
      author: formData.author || 'Liorian Technology',
      category: formData.category || '',
      image: formData.image || 'https://via.placeholder.com/800x600',
      tags: formData.tags || [],
      featured: formData.featured || false,
      published: formData.published || false,
      readTime: formData.readTime || '5 min read',
      readingLevel: formData.readingLevel || 'Beginner',
      staffAccess: []
    });

    setFormData({
      title: '',
      excerpt: '',
      content: '',
      author: '',
      category: '',
      image: '',
      tags: [],
      featured: false,
      published: false,
      readTime: '5 min read',
      readingLevel: 'Beginner'
    });
    setShowCreateModal(false);
    alert('Blog created successfully!');
  };

  const handleEditBlog = () => {
    if (!selectedBlog) return;

    blogManager.updateBlog(selectedBlog.id, {
      ...formData,
      title: formData.title || selectedBlog.title,
      excerpt: formData.excerpt || selectedBlog.excerpt,
      content: formData.content || selectedBlog.content,
      category: formData.category || selectedBlog.category
    });

    setShowEditModal(false);
    alert('Blog updated successfully!');
  };

  const handleDeleteBlog = (id: number) => {
    if (confirm('Are you sure you want to delete this blog?')) {
      blogManager.deleteBlog(id);
      alert('Blog deleted successfully!');
    }
  };

  const handleTogglePublish = (blog: BlogPost) => {
    blogManager.updateBlog(blog.id, { published: !blog.published });
  };

  const handleAssignStaff = () => {
    if (!selectedBlog) return;

    selectedStaffForAssignment.forEach(staffId => {
      blogManager.assignBlogToStaff(selectedBlog.id, staffId);
    });

    setShowStaffModal(false);
    setSelectedStaffForAssignment([]);
    alert('Blog assigned to staff successfully!');
  };

  const openEditModal = (blog: BlogPost) => {
    setSelectedBlog(blog);
    setFormData({
      title: blog.title,
      excerpt: blog.excerpt,
      content: blog.content,
      author: blog.author,
      category: blog.category,
      image: blog.image,
      tags: blog.tags,
      featured: blog.featured,
      published: blog.published,
      readTime: blog.readTime,
      readingLevel: blog.readingLevel
    });
    setShowEditModal(true);
  };

  const openStaffModal = (blog: BlogPost) => {
    setSelectedBlog(blog);
    setSelectedStaffForAssignment(blog.staffAccess || []);
    setShowStaffModal(true);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardNavigation userType="admin" userName="Admin" />

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Blog Management</h1>
          <p className="text-gray-600 mt-2">Create, edit, and manage blog articles</p>
        </div>

        {/* Controls */}
        <div className="flex flex-wrap gap-4 mb-6">
          <button
            onClick={() => {
              setFormData({
                title: '',
                excerpt: '',
                content: '',
                author: '',
                category: '',
                image: '',
                tags: [],
                featured: false,
                published: false,
                readTime: '5 min read',
                readingLevel: 'Beginner'
              });
              setShowCreateModal(true);
            }}
            className="flex items-center gap-2 bg-gradient-to-r from-premium-gold to-premium-bronze text-white px-4 py-2 rounded-lg font-medium hover:shadow-lg transition-all"
          >
            <Plus className="w-5 h-5" />
            Create Blog
          </button>

          <input
            type="text"
            placeholder="Search blogs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
          />

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as any)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
          >
            <option value="all">All Status</option>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
          </select>
        </div>

        {/* Blogs Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-100 border-b">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Title</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Category</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Status</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Author</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Staff Access</th>
                  <th className="px-6 py-3 text-center text-sm font-semibold text-gray-900">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {filteredBlogs.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                      No blogs found
                    </td>
                  </tr>
                ) : (
                  filteredBlogs.map((blog) => (
                    <tr key={blog.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">{blog.title}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{blog.category}</td>
                      <td className="px-6 py-4 text-sm">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          blog.published
                            ? 'bg-green-100 text-green-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {blog.published ? 'Published' : 'Draft'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">{blog.author}</td>
                      <td className="px-6 py-4 text-sm">
                        <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                          {blog.staffAccess?.length || 0} staff
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => handleTogglePublish(blog)}
                            className="p-1 text-gray-600 hover:text-primary transition-colors"
                            title={blog.published ? 'Unpublish' : 'Publish'}
                          >
                            {blog.published ? (
                              <Eye className="w-4 h-4" />
                            ) : (
                              <EyeOff className="w-4 h-4" />
                            )}
                          </button>
                          <button
                            onClick={() => openStaffModal(blog)}
                            className="p-1 text-gray-600 hover:text-primary transition-colors"
                            title="Assign to Staff"
                          >
                            <Users className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => openEditModal(blog)}
                            className="p-1 text-gray-600 hover:text-primary transition-colors"
                            title="Edit"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteBlog(blog.id)}
                            className="p-1 text-gray-600 hover:text-red-600 transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Create/Edit Modal */}
      {(showCreateModal || showEditModal) && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b p-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">
                {showEditModal ? 'Edit Blog' : 'Create New Blog'}
              </h2>
              <button
                onClick={() => {
                  setShowCreateModal(false);
                  setShowEditModal(false);
                  setSelectedBlog(null);
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">Title *</label>
                <input
                  type="text"
                  value={formData.title || ''}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
                  placeholder="Blog title"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">Excerpt *</label>
                <textarea
                  value={formData.excerpt || ''}
                  onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                  rows={2}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
                  placeholder="Brief summary of the blog"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">Content *</label>
                <textarea
                  value={formData.content || ''}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
                  placeholder="Full blog content"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">Category *</label>
                  <input
                    type="text"
                    value={formData.category || ''}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
                    placeholder="e.g., Cloud Computing"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">Author</label>
                  <input
                    type="text"
                    value={formData.author || ''}
                    onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
                    placeholder="Author name"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">Read Time</label>
                  <input
                    type="text"
                    value={formData.readTime || ''}
                    onChange={(e) => setFormData({ ...formData, readTime: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
                    placeholder="e.g., 5 min read"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">Reading Level</label>
                  <select
                    value={formData.readingLevel || ''}
                    onChange={(e) => setFormData({ ...formData, readingLevel: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
                  >
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">Image URL</label>
                <input
                  type="url"
                  value={formData.image || ''}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
                  placeholder="https://example.com/image.jpg"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">Tags</label>
                <input
                  type="text"
                  value={(formData.tags || []).join(', ')}
                  onChange={(e) => setFormData({ ...formData, tags: e.target.value.split(',').map(t => t.trim()) })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
                  placeholder="Separate tags with commas"
                />
              </div>

              <div className="flex gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.featured || false}
                    onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                    className="w-4 h-4"
                  />
                  <span className="text-sm text-gray-700">Featured Article</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.published || false}
                    onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
                    className="w-4 h-4"
                  />
                  <span className="text-sm text-gray-700">Publish Now</span>
                </label>
              </div>
            </div>

            <div className="border-t p-6 flex gap-2 justify-end">
              <button
                onClick={() => {
                  setShowCreateModal(false);
                  setShowEditModal(false);
                  setSelectedBlog(null);
                }}
                className="px-4 py-2 border border-gray-300 rounded-lg font-medium hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={showEditModal ? handleEditBlog : handleCreateBlog}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-premium-gold to-premium-bronze text-white rounded-lg font-medium hover:shadow-lg transition-all"
              >
                <Save className="w-4 h-4" />
                {showEditModal ? 'Update Blog' : 'Create Blog'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Assign to Staff Modal */}
      {showStaffModal && selectedBlog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full">
            <div className="border-b p-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">Assign to Staff</h2>
              <button
                onClick={() => {
                  setShowStaffModal(false);
                  setSelectedBlog(null);
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6 space-y-3 max-h-64 overflow-y-auto">
              {staffList.map(staff => (
                <label key={staff.id} className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 p-2 rounded">
                  <input
                    type="checkbox"
                    checked={selectedStaffForAssignment.includes(staff.id)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedStaffForAssignment([...selectedStaffForAssignment, staff.id]);
                      } else {
                        setSelectedStaffForAssignment(selectedStaffForAssignment.filter(id => id !== staff.id));
                      }
                    }}
                    className="w-4 h-4"
                  />
                  <span className="text-gray-700">{staff.name}</span>
                </label>
              ))}
            </div>

            <div className="border-t p-6 flex gap-2 justify-end">
              <button
                onClick={() => {
                  setShowStaffModal(false);
                  setSelectedBlog(null);
                }}
                className="px-4 py-2 border border-gray-300 rounded-lg font-medium hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleAssignStaff}
                className="px-4 py-2 bg-gradient-to-r from-premium-gold to-premium-bronze text-white rounded-lg font-medium hover:shadow-lg transition-all"
              >
                Assign
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
