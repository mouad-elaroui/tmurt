"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"

// Types dial l-family data
interface FamilyMember {
    id: string
    customer_id: string
    role: "owner" | "admin" | "member"
}

interface FamilyGroup {
    id: string
    name: string
    invite_code: string | null
    role: string
    member_count: number
    members: FamilyMember[]
}

interface WishlistItem {
    id: string
    product_id: string
    added_by: string
    note: string | null
    priority: string | null
    added_at: string
}

// Zellige Pattern Background - l-design l-marocain
const ZelligePattern = ({ className = "" }: { className?: string }) => (
    <svg className={className} viewBox="0 0 100 100" preserveAspectRatio="none">
        <defs>
            <pattern id="zellige-hub" x="0" y="0" width="25" height="25" patternUnits="userSpaceOnUse">
                {/* Star pattern */}
                <polygon
                    points="12.5,0 15.5,9.5 25,9.5 17.5,15.5 20,25 12.5,19 5,25 7.5,15.5 0,9.5 9.5,9.5"
                    fill="none"
                    stroke="#D4AF37"
                    strokeWidth="0.5"
                    opacity="0.3"
                />
                {/* Inner diamond */}
                <polygon
                    points="12.5,5 17,12.5 12.5,20 8,12.5"
                    fill="none"
                    stroke="#D4AF37"
                    strokeWidth="0.3"
                    opacity="0.2"
                />
            </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#zellige-hub)" />
    </svg>
)

// Member Avatar with Golden Ring - l-avatar b l-ring dhehbi
const MemberAvatar = ({
    member,
    isOwner = false,
    size = "md"
}: {
    member: FamilyMember
    isOwner?: boolean
    size?: "sm" | "md" | "lg"
}) => {
    const sizeClasses = {
        sm: "w-10 h-10",
        md: "w-14 h-14",
        lg: "w-20 h-20"
    }

    const ringWidth = {
        sm: "ring-2",
        md: "ring-[3px]",
        lg: "ring-4"
    }

    // Generate initials from customer_id (in real app, would use name)
    const initials = member.customer_id.slice(0, 2).toUpperCase()

    // Generate color based on role
    const bgColor = member.role === "owner"
        ? "bg-gradient-to-br from-[#D4AF37] to-[#B8963E]"
        : member.role === "admin"
            ? "bg-gradient-to-br from-blue-500 to-blue-600"
            : "bg-gradient-to-br from-gray-400 to-gray-500"

    return (
        <motion.div
            className={`
                relative ${sizeClasses[size]} rounded-full ${bgColor}
                ${ringWidth[size]} ring-[#D4AF37] ring-offset-2 ring-offset-white
                flex items-center justify-center text-white font-bold
                shadow-lg shadow-[#D4AF37]/20
            `}
            whileHover={{ scale: 1.1 }}
            transition={{ type: "spring", stiffness: 400 }}
        >
            <span className={size === "lg" ? "text-xl" : size === "md" ? "text-sm" : "text-xs"}>
                {initials}
            </span>

            {/* Owner crown */}
            {isOwner && (
                <div className="absolute -top-2 left-1/2 -translate-x-1/2">
                    <svg className="w-4 h-4 text-[#D4AF37]" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M5 16L3 5l5.5 5L12 4l3.5 6L21 5l-2 11H5z" />
                    </svg>
                </div>
            )}
        </motion.div>
    )
}

// Invite Modal - l-modal bach t-inviti
const InviteModal = ({
    isOpen,
    onClose,
    groupId,
    onInviteSent
}: {
    isOpen: boolean
    onClose: () => void
    groupId: string
    onInviteSent: () => void
}) => {
    const [email, setEmail] = useState("")
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const handleInvite = async () => {
        if (!email.trim()) return

        try {
            setLoading(true)
            setError(null)

            const response = await fetch("/store/family/invite", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({ group_id: groupId, email }),
            })

            const data = await response.json()

            if (!response.ok) {
                throw new Error(data.error || "Failed to send invitation")
            }

            setEmail("")
            onInviteSent()
            onClose()
        } catch (err: any) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    className="fixed inset-0 z-50 flex items-center justify-center p-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                >
                    {/* Backdrop */}
                    <motion.div
                        className="absolute inset-0 bg-black/50"
                        onClick={onClose}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    />

                    {/* Modal */}
                    <motion.div
                        className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden"
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.9, opacity: 0 }}
                    >
                        {/* Zellige header */}
                        <div className="relative h-20 bg-gradient-to-r from-[#1a1a2e] to-[#16213e] overflow-hidden">
                            <ZelligePattern className="absolute inset-0 w-full h-full opacity-50" />
                            <div className="absolute inset-0 flex items-center justify-center">
                                <h3 className="text-white font-semibold text-lg">Invite Family Member</h3>
                            </div>
                        </div>

                        {/* Content */}
                        <div className="p-6">
                            <p className="text-gray-600 text-sm mb-4">
                                Enter the email address of the family member you want to invite.
                            </p>

                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Enter email address"
                                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20 outline-none transition-all"
                            />

                            {error && (
                                <p className="text-red-500 text-sm mt-2">{error}</p>
                            )}

                            <div className="flex gap-3 mt-6">
                                <button
                                    onClick={onClose}
                                    className="flex-1 px-4 py-3 border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleInvite}
                                    disabled={loading || !email.trim()}
                                    className="flex-1 px-4 py-3 bg-[#D4AF37] text-white rounded-xl hover:bg-[#B8963E] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {loading ? "Sending..." : "Send Invite"}
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}

// Create Group Modal
const CreateGroupModal = ({
    isOpen,
    onClose,
    onGroupCreated
}: {
    isOpen: boolean
    onClose: () => void
    onGroupCreated: () => void
}) => {
    const [name, setName] = useState("")
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const handleCreate = async () => {
        if (!name.trim()) return

        try {
            setLoading(true)
            setError(null)

            const response = await fetch("/store/family", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({ name }),
            })

            const data = await response.json()

            if (!response.ok) {
                throw new Error(data.error || "Failed to create group")
            }

            setName("")
            onGroupCreated()
            onClose()
        } catch (err: any) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    className="fixed inset-0 z-50 flex items-center justify-center p-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                >
                    <motion.div
                        className="absolute inset-0 bg-black/50"
                        onClick={onClose}
                    />

                    <motion.div
                        className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden"
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.9, opacity: 0 }}
                    >
                        <div className="relative h-20 bg-gradient-to-r from-[#D4AF37] to-[#B8963E] overflow-hidden">
                            <ZelligePattern className="absolute inset-0 w-full h-full opacity-30" />
                            <div className="absolute inset-0 flex items-center justify-center">
                                <h3 className="text-white font-semibold text-lg">Create Family Group</h3>
                            </div>
                        </div>

                        <div className="p-6">
                            <p className="text-gray-600 text-sm mb-4">
                                Give your family group a name to get started.
                            </p>

                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="e.g., The Fassi Family"
                                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20 outline-none transition-all"
                            />

                            {error && (
                                <p className="text-red-500 text-sm mt-2">{error}</p>
                            )}

                            <div className="flex gap-3 mt-6">
                                <button
                                    onClick={onClose}
                                    className="flex-1 px-4 py-3 border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleCreate}
                                    disabled={loading || !name.trim()}
                                    className="flex-1 px-4 py-3 bg-[#D4AF37] text-white rounded-xl hover:bg-[#B8963E] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {loading ? "Creating..." : "Create Group"}
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}

// Join Group Modal
const JoinGroupModal = ({
    isOpen,
    onClose,
    onJoined
}: {
    isOpen: boolean
    onClose: () => void
    onJoined: () => void
}) => {
    const [code, setCode] = useState("")
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const handleJoin = async () => {
        if (!code.trim()) return

        try {
            setLoading(true)
            setError(null)

            const response = await fetch("/store/family/join", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({ invite_code: code }),
            })

            const data = await response.json()

            if (!response.ok) {
                throw new Error(data.error || "Failed to join group")
            }

            setCode("")
            onJoined()
            onClose()
        } catch (err: any) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    className="fixed inset-0 z-50 flex items-center justify-center p-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                >
                    <motion.div className="absolute inset-0 bg-black/50" onClick={onClose} />

                    <motion.div
                        className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden"
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.9, opacity: 0 }}
                    >
                        <div className="relative h-20 bg-gradient-to-r from-[#16213e] to-[#1a1a2e] overflow-hidden">
                            <ZelligePattern className="absolute inset-0 w-full h-full opacity-50" />
                            <div className="absolute inset-0 flex items-center justify-center">
                                <h3 className="text-white font-semibold text-lg">Join Family Group</h3>
                            </div>
                        </div>

                        <div className="p-6">
                            <p className="text-gray-600 text-sm mb-4">
                                Enter the invite code shared with you to join a family group.
                            </p>

                            <input
                                type="text"
                                value={code}
                                onChange={(e) => setCode(e.target.value.toUpperCase())}
                                placeholder="e.g., FAM-ABCD12"
                                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20 outline-none transition-all font-mono text-center text-lg tracking-wider"
                                maxLength={10}
                            />

                            {error && (
                                <p className="text-red-500 text-sm mt-2">{error}</p>
                            )}

                            <div className="flex gap-3 mt-6">
                                <button onClick={onClose} className="flex-1 px-4 py-3 border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50 transition-colors">
                                    Cancel
                                </button>
                                <button
                                    onClick={handleJoin}
                                    disabled={loading || !code.trim()}
                                    className="flex-1 px-4 py-3 bg-[#D4AF37] text-white rounded-xl hover:bg-[#B8963E] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {loading ? "Joining..." : "Join Group"}
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}

// Main Family Hub Component
export default function FamilyHub({ className = "" }: { className?: string }) {
    const [groups, setGroups] = useState<FamilyGroup[]>([])
    const [loading, setLoading] = useState(true)
    const [selectedGroup, setSelectedGroup] = useState<FamilyGroup | null>(null)
    const [showInviteModal, setShowInviteModal] = useState(false)
    const [showCreateModal, setShowCreateModal] = useState(false)
    const [showJoinModal, setShowJoinModal] = useState(false)

    useEffect(() => {
        fetchGroups()
    }, [])

    const fetchGroups = async () => {
        try {
            setLoading(true)
            const response = await fetch("/store/family", { credentials: "include" })
            const data = await response.json()
            setGroups(data.groups || [])
            if (data.groups?.length > 0 && !selectedGroup) {
                setSelectedGroup(data.groups[0])
            }
        } catch (err) {
            console.error("[FamilyHub] Error:", err)
        } finally {
            setLoading(false)
        }
    }

    // Loading state
    if (loading) {
        return (
            <div className={`${className} animate-pulse`}>
                <div className="h-32 bg-gray-100 rounded-2xl mb-4" />
                <div className="h-48 bg-gray-100 rounded-2xl" />
            </div>
        )
    }

    // No groups state
    if (groups.length === 0) {
        return (
            <div className={className}>
                <div className="text-center py-12 bg-gradient-to-b from-gray-50 to-white rounded-2xl border border-gray-100">
                    <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-[#D4AF37]/20 to-[#D4AF37]/5 flex items-center justify-center">
                        <svg className="w-10 h-10 text-[#D4AF37]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No Family Groups</h3>
                    <p className="text-gray-500 text-sm mb-6 max-w-xs mx-auto">
                        Create a family group to shop together and share wishlists with your loved ones.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-3 justify-center px-4">
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => setShowCreateModal(true)}
                            className="relative px-6 py-3 rounded-xl text-white font-medium overflow-hidden group"
                        >
                            {/* Zellige background */}
                            <div className="absolute inset-0 bg-gradient-to-r from-[#D4AF37] to-[#B8963E]" />
                            <ZelligePattern className="absolute inset-0 w-full h-full opacity-20 group-hover:opacity-30 transition-opacity" />
                            <span className="relative flex items-center gap-2">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                </svg>
                                Create Group
                            </span>
                        </motion.button>

                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => setShowJoinModal(true)}
                            className="px-6 py-3 bg-white border-2 border-[#D4AF37] text-[#D4AF37] rounded-xl font-medium hover:bg-[#D4AF37]/5 transition-colors"
                        >
                            Join with Code
                        </motion.button>
                    </div>
                </div>

                <CreateGroupModal
                    isOpen={showCreateModal}
                    onClose={() => setShowCreateModal(false)}
                    onGroupCreated={fetchGroups}
                />
                <JoinGroupModal
                    isOpen={showJoinModal}
                    onClose={() => setShowJoinModal(false)}
                    onJoined={fetchGroups}
                />
            </div>
        )
    }

    return (
        <div className={className}>
            {/* Group Header */}
            {selectedGroup && (
                <motion.div
                    className="bg-gradient-to-br from-[#1a1a2e] via-[#16213e] to-[#0f3460] rounded-2xl p-6 mb-6 overflow-hidden relative"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <ZelligePattern className="absolute inset-0 w-full h-full opacity-10" />

                    <div className="relative">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-xl font-bold text-white">{selectedGroup.name}</h2>
                            {selectedGroup.invite_code && (
                                <div className="bg-white/10 backdrop-blur-sm px-3 py-1.5 rounded-lg">
                                    <p className="text-xs text-white/60 mb-0.5">Invite Code</p>
                                    <p className="font-mono text-[#D4AF37] font-bold tracking-wider">
                                        {selectedGroup.invite_code}
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* Members */}
                        <div className="flex items-center gap-3">
                            <div className="flex -space-x-2">
                                {selectedGroup.members.slice(0, 5).map((member, index) => (
                                    <motion.div
                                        key={member.id}
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: index * 0.1 }}
                                    >
                                        <MemberAvatar
                                            member={member}
                                            isOwner={member.role === "owner"}
                                            size="sm"
                                        />
                                    </motion.div>
                                ))}
                                {selectedGroup.member_count > 5 && (
                                    <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-xs font-medium text-gray-600 ring-2 ring-white">
                                        +{selectedGroup.member_count - 5}
                                    </div>
                                )}
                            </div>

                            {(selectedGroup.role === "owner" || selectedGroup.role === "admin") && (
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => setShowInviteModal(true)}
                                    className="ml-auto relative px-4 py-2 rounded-lg text-white text-sm font-medium overflow-hidden group"
                                >
                                    <div className="absolute inset-0 bg-[#D4AF37]" />
                                    <ZelligePattern className="absolute inset-0 w-full h-full opacity-20 group-hover:opacity-40 transition-opacity" />
                                    <span className="relative flex items-center gap-2">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                        </svg>
                                        Invite
                                    </span>
                                </motion.button>
                            )}
                        </div>
                    </div>
                </motion.div>
            )}

            {/* Shared Wishlist Section */}
            <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                    <h3 className="font-medium text-gray-900">Shared Wishlist</h3>
                    <span className="text-sm text-gray-500">
                        {selectedGroup?.member_count || 0} members
                    </span>
                </div>
                <div className="p-6">
                    <div className="text-center py-8 text-gray-500">
                        <svg className="w-12 h-12 mx-auto text-gray-300 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                        <p>No items in shared wishlist yet</p>
                        <p className="text-sm mt-1">Browse products and add them to share with your family</p>
                    </div>
                </div>
            </div>

            {/* Modals */}
            <InviteModal
                isOpen={showInviteModal}
                onClose={() => setShowInviteModal(false)}
                groupId={selectedGroup?.id || ""}
                onInviteSent={fetchGroups}
            />
            <CreateGroupModal
                isOpen={showCreateModal}
                onClose={() => setShowCreateModal(false)}
                onGroupCreated={fetchGroups}
            />
            <JoinGroupModal
                isOpen={showJoinModal}
                onClose={() => setShowJoinModal(false)}
                onJoined={fetchGroups}
            />
        </div>
    )
}
