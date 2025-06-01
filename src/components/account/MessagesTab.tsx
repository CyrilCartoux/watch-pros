"use client"

import { useState } from "react"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import mockData from "@/data/mock-conversations.json"

type Conversation = typeof mockData.conversations[0]

export function MessagesTab() {
  const [selectedConversation, setSelectedConversation] = useState<number | null>(null)
  const [showMobileConversation, setShowMobileConversation] = useState(false)

  const handleSelectConversation = (id: number) => {
    setSelectedConversation(id)
    setShowMobileConversation(true)
  }

  const selectedConversationData = selectedConversation 
    ? mockData.conversations.find(c => c.id === selectedConversation)
    : null

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 h-full">
      {/* Liste des conversations */}
      <div className={`md:col-span-1 border rounded-lg overflow-hidden flex flex-col h-full ${showMobileConversation ? 'hidden md:flex' : 'flex'}`}>
        {/* Filtres */}
        <div className="p-4 border-b">
          <div className="flex gap-2">
            <button className="px-3 py-1.5 text-sm font-medium rounded-md bg-primary text-primary-foreground">
              Tout
            </button>
            <button className="px-3 py-1.5 text-sm font-medium rounded-md hover:bg-muted">
              Non lus
            </button>
          </div>
        </div>

        {/* Liste */}
        <div className="flex-1 overflow-y-auto">
          <div className="divide-y">
            {mockData.conversations.map((conversation) => (
              <button 
                key={conversation.id}
                className={`w-full p-4 hover:bg-muted/50 transition-colors text-left ${selectedConversation === conversation.id ? 'bg-muted/50' : ''}`}
                onClick={() => handleSelectConversation(conversation.id)}
              >
                <div className="flex items-start gap-3">
                  <div className="relative">
                    <img
                      src={conversation.user.avatar}
                      alt={conversation.user.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <span className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-background ${conversation.user.isOnline ? 'bg-green-500' : 'bg-gray-400'}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <p className="font-medium truncate">{conversation.user.name}</p>
                      <span className="text-sm text-muted-foreground">
                        {new Date(conversation.lastMessage.timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground truncate">
                      {conversation.lastMessage.content}
                    </p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Détail de la conversation */}
      <div className={`md:col-span-2 border rounded-lg overflow-hidden flex flex-col h-full ${!showMobileConversation ? 'hidden md:flex' : 'flex'}`}>
        {selectedConversationData ? (
          <>
            {/* Header avec infos du vendeur */}
            <div className="p-4 border-b">
              <div className="flex items-center gap-3">
                <button 
                  className="md:hidden p-2 hover:bg-muted rounded-full"
                  onClick={() => setShowMobileConversation(false)}
                >
                  <ArrowLeft className="h-5 w-5" />
                </button>
                <Link href={`/profile/${selectedConversationData.user.id}`} className="flex items-center gap-3 flex-1">
                  <img
                    src={selectedConversationData.user.avatar}
                    alt={selectedConversationData.user.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <h3 className="font-medium">{selectedConversationData.user.name}</h3>
                    <p className="text-sm text-muted-foreground">Vendeur depuis {selectedConversationData.user.sellerSince}</p>
                  </div>
                </Link>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {selectedConversationData.messages.map((message) => (
                <div 
                  key={message.id}
                  className={`flex gap-3 ${message.senderId === "currentUser" ? "justify-end" : ""}`}
                >
                  {message.senderId !== "currentUser" && (
                    <img
                      src={selectedConversationData.user.avatar}
                      alt={selectedConversationData.user.name}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                  )}
                  <div className={`flex-1 ${message.senderId === "currentUser" ? "max-w-[80%]" : ""}`}>
                    <div className={`rounded-lg p-3 ${
                      message.senderId === "currentUser" 
                        ? "bg-primary text-primary-foreground" 
                        : "bg-muted"
                    }`}>
                      <p>{message.content}</p>
                    </div>
                    <span className={`text-xs text-muted-foreground mt-1 block ${
                      message.senderId === "currentUser" ? "text-right" : ""
                    }`}>
                      {new Date(message.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Input pour nouveau message */}
            <div className="p-4 border-t">
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Écrivez votre message..."
                  className="flex-1 px-3 py-2 rounded-md border"
                />
                <button className="px-4 py-2 bg-primary text-primary-foreground rounded-md">
                  Envoyer
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-muted-foreground">
            Sélectionnez une conversation pour commencer
          </div>
        )}
      </div>
    </div>
  )
} 