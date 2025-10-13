import React, { useState, useEffect } from 'react'

export default function WaitlistAdmin() {
  const [waitlistEntries, setWaitlistEntries] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [selectedEntries, setSelectedEntries] = useState([])
  const [accessMessage, setAccessMessage] = useState('')
  const [isSendingAccess, setIsSendingAccess] = useState(false)

  // Mock data for demonstration - in production, this would come from your backend
  const mockWaitlistData = [
    {
      id: 1,
      email: 'john@example.com',
      name: 'John Doe',
      company: 'Tech Corp',
      signupDate: '2024-01-15',
      status: 'waiting',
      accessGranted: false
    },
    {
      id: 2,
      email: 'jane@startup.io',
      name: 'Jane Smith',
      company: 'Startup Inc',
      signupDate: '2024-01-16',
      status: 'waiting',
      accessGranted: false
    },
    {
      id: 3,
      email: 'mike@university.edu',
      name: 'Mike Johnson',
      company: 'University',
      signupDate: '2024-01-17',
      status: 'waiting',
      accessGranted: false
    }
  ]

  useEffect(() => {
    // In production, fetch from your backend API
    setWaitlistEntries(mockWaitlistData)
  }, [])

  const handleSelectEntry = (entryId) => {
    setSelectedEntries(prev => 
      prev.includes(entryId) 
        ? prev.filter(id => id !== entryId)
        : [...prev, entryId]
    )
  }

  const handleSelectAll = () => {
    if (selectedEntries.length === waitlistEntries.length) {
      setSelectedEntries([])
    } else {
      setSelectedEntries(waitlistEntries.map(entry => entry.id))
    }
  }

  const handleGrantAccess = async () => {
    if (selectedEntries.length === 0) return

    setIsSendingAccess(true)
    
    try {
      // In production, this would call your backend API
      // For now, we'll simulate the process
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Update local state
      setWaitlistEntries(prev => 
        prev.map(entry => 
          selectedEntries.includes(entry.id) 
            ? { ...entry, status: 'access_granted', accessGranted: true }
            : entry
        )
      )
      
      setSelectedEntries([])
      setAccessMessage('')
      
      alert(`Access granted to ${selectedEntries.length} user(s)! They will receive notification emails.`)
    } catch (error) {
      console.error('Error granting access:', error)
      alert('Error granting access. Please try again.')
    } finally {
      setIsSendingAccess(false)
    }
  }

  const handleSendBulkMessage = async () => {
    if (selectedEntries.length === 0 || !accessMessage.trim()) return

    setIsSendingAccess(true)
    
    try {
      // In production, this would call your backend API
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      alert(`Message sent to ${selectedEntries.length} user(s)!`)
      setAccessMessage('')
    } catch (error) {
      console.error('Error sending message:', error)
      alert('Error sending message. Please try again.')
    } finally {
      setIsSendingAccess(false)
    }
  }

  const getStatusBadge = (status) => {
    const badges = {
      waiting: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
      access_granted: 'bg-green-500/20 text-green-400 border-green-500/30',
      notified: 'bg-blue-500/20 text-blue-400 border-blue-500/30'
    }
    
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium border ${badges[status] || badges.waiting}`}>
        {status.replace('_', ' ').toUpperCase()}
      </span>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">ByteNimbus Waitlist Admin</h1>
          <p className="text-gray-400">Manage waitlist entries and grant access to users</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gray-800 p-6 rounded-xl">
            <h3 className="text-lg font-semibold mb-2">Total Signups</h3>
            <p className="text-3xl font-bold text-blue-400">{waitlistEntries.length}</p>
          </div>
          <div className="bg-gray-800 p-6 rounded-xl">
            <h3 className="text-lg font-semibold mb-2">Waiting</h3>
            <p className="text-3xl font-bold text-yellow-400">
              {waitlistEntries.filter(entry => entry.status === 'waiting').length}
            </p>
          </div>
          <div className="bg-gray-800 p-6 rounded-xl">
            <h3 className="text-lg font-semibold mb-2">Access Granted</h3>
            <p className="text-3xl font-bold text-green-400">
              {waitlistEntries.filter(entry => entry.accessGranted).length}
            </p>
          </div>
        </div>

        {/* Bulk Actions */}
        {selectedEntries.length > 0 && (
          <div className="bg-gray-800 p-6 rounded-xl mb-8">
            <h3 className="text-lg font-semibold mb-4">
              Bulk Actions ({selectedEntries.length} selected)
            </h3>
            <div className="flex flex-col md:flex-row gap-4">
              <button
                onClick={handleGrantAccess}
                disabled={isSendingAccess}
                className="px-6 py-3 bg-green-600 hover:bg-green-700 rounded-lg font-medium transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSendingAccess ? 'Granting...' : 'Grant Access'}
              </button>
              
              <div className="flex-1 flex gap-2">
                <input
                  type="text"
                  value={accessMessage}
                  onChange={(e) => setAccessMessage(e.target.value)}
                  placeholder="Send a message to selected users..."
                  className="flex-1 px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-blue-500"
                />
                <button
                  onClick={handleSendBulkMessage}
                  disabled={isSendingAccess || !accessMessage.trim()}
                  className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-medium transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Send Message
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Waitlist Table */}
        <div className="bg-gray-800 rounded-xl overflow-hidden">
          <div className="p-6 border-b border-gray-700">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold">Waitlist Entries</h3>
              <div className="flex items-center gap-4">
                <button
                  onClick={handleSelectAll}
                  className="text-sm text-blue-400 hover:text-blue-300 transition"
                >
                  {selectedEntries.length === waitlistEntries.length ? 'Deselect All' : 'Select All'}
                </button>
                <span className="text-sm text-gray-400">
                  {selectedEntries.length} selected
                </span>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-700">
                <tr>
                  <th className="px-6 py-4 text-left">
                    <input
                      type="checkbox"
                      checked={selectedEntries.length === waitlistEntries.length && waitlistEntries.length > 0}
                      onChange={handleSelectAll}
                      className="rounded border-gray-600 bg-gray-800"
                    />
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Email</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Name</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Company</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Signup Date</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Status</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {waitlistEntries.map((entry) => (
                  <tr key={entry.id} className="hover:bg-gray-700/50 transition">
                    <td className="px-6 py-4">
                      <input
                        type="checkbox"
                        checked={selectedEntries.includes(entry.id)}
                        onChange={() => handleSelectEntry(entry.id)}
                        className="rounded border-gray-600 bg-gray-800"
                      />
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium">{entry.email}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-300">{entry.name}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-300">{entry.company}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-300">{entry.signupDate}</div>
                    </td>
                    <td className="px-6 py-4">
                      {getStatusBadge(entry.status)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        {!entry.accessGranted && (
                          <button
                            onClick={() => {
                              setSelectedEntries([entry.id])
                              handleGrantAccess()
                            }}
                            className="px-3 py-1 bg-green-600 hover:bg-green-700 rounded text-xs font-medium transition"
                          >
                            Grant Access
                          </button>
                        )}
                        <button className="px-3 py-1 bg-blue-600 hover:bg-blue-700 rounded text-xs font-medium transition">
                          Message
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Instructions */}
        <div className="mt-8 bg-blue-900/20 border border-blue-500/30 rounded-xl p-6">
          <h3 className="text-lg font-semibold mb-4 text-blue-400">How to Use This Admin Panel</h3>
          <div className="space-y-2 text-sm text-gray-300">
            <p>• <strong>Select users</strong> by checking the boxes next to their names</p>
            <p>• <strong>Grant Access</strong> to selected users - they'll receive an email notification</p>
            <p>• <strong>Send Messages</strong> to communicate with users before granting access</p>
            <p>• <strong>Track Status</strong> to see who has been granted access</p>
            <p className="mt-4 text-blue-300">
              <strong>Note:</strong> This is a demo interface. In production, you'll need to connect this to your backend API and email service.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
