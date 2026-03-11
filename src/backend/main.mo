import Array "mo:core/Array";
import Map "mo:core/Map";
import Int "mo:core/Int";
import Time "mo:core/Time";
import Order "mo:core/Order";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

actor {
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  public type UserProfile = {
    name : Text;
  };

  let userProfiles = Map.empty<Principal, UserProfile>();

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can get profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  type Message = {
    role : Text;
    content : Text;
    timestamp : Int;
  };

  module Message {
    public func compare(message1 : Message, message2 : Message) : Order.Order {
      Int.compare(message1.timestamp, message2.timestamp);
    };
  };

  type Conversation = {
    id : Nat;
    title : Text;
    timestamp : Int;
    owner : Principal;
    messages : [Message];
  };

  module Conversation {
    public func compare(conversation1 : Conversation, conversation2 : Conversation) : Order.Order {
      Int.compare(conversation2.timestamp, conversation1.timestamp);
    };
  };

  let conversations = Map.empty<Nat, Conversation>();
  var nextConversationId = 0;

  public shared ({ caller }) func createConversation(title : Text) : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can create conversations");
    };
    let conversationId = nextConversationId;
    nextConversationId += 1;

    let newConversation : Conversation = {
      id = conversationId;
      title;
      timestamp = Time.now();
      owner = caller;
      messages = [];
    };

    conversations.add(conversationId, newConversation);
    conversationId;
  };

  public shared ({ caller }) func sendMessage(conversationId : Nat, content : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can send messages");
    };

    switch (conversations.get(conversationId)) {
      case (null) { Runtime.trap("Conversation not found") };
      case (?conversation) {
        if (conversation.owner != caller) { Runtime.trap("Unauthorized: Not the conversation owner") };

        let userMessage : Message = {
          role = "user";
          content;
          timestamp = Time.now();
        };

        let assistantMessage : Message = {
          role = "assistant";
          content = "This is a simulated reply to: " # content;
          timestamp = Time.now();
        };

        let updatedConversation : Conversation = {
          conversation with
          messages = conversation.messages.concat([userMessage, assistantMessage]);
        };

        conversations.add(conversationId, updatedConversation);
      };
    };
  };

  public query ({ caller }) func getMessages(conversationId : Nat) : async [Message] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can get messages");
    };

    switch (conversations.get(conversationId)) {
      case (null) { Runtime.trap("Conversation not found") };
      case (?conversation) {
        if (conversation.owner != caller and not (AccessControl.isAdmin(accessControlState, caller))) {
          Runtime.trap("Unauthorized: No permission to view messages in this conversation");
        };
        conversation.messages.sort();
      };
    };
  };

  public query ({ caller }) func listConversations() : async [Conversation] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can list conversations");
    };

    let userConversations = conversations.values().toArray().filter(
      func(conversation) {
        conversation.owner == caller or AccessControl.isAdmin(accessControlState, caller)
      }
    );
    userConversations.sort();
  };

  public shared ({ caller }) func deleteConversation(conversationId : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can delete conversations");
    };

    switch (conversations.get(conversationId)) {
      case (null) { Runtime.trap("Conversation not found") };
      case (?conversation) {
        if (conversation.owner != caller and not (AccessControl.isAdmin(accessControlState, caller))) {
          Runtime.trap("Unauthorized: No permission to delete this conversation");
        };
        conversations.remove(conversationId);
      };
    };
  };
};
