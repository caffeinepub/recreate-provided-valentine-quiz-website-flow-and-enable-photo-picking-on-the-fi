import MixinStorage "blob-storage/Mixin";
import Storage "blob-storage/Storage";
import List "mo:core/List";
import Runtime "mo:core/Runtime";
import Map "mo:core/Map";
import Principal "mo:core/Principal";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

actor {
  include MixinStorage();

  // Initialize access control system
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // Media Types
  type MediaType = {
    #image;
    #video;
  };

  type MediaItem = {
    id : Text;
    blob : Storage.ExternalBlob;
    mediaType : MediaType;
    description : Text;
    fileName : Text;
  };

  // User Profile Type
  public type UserProfile = {
    name : Text;
  };

  let userProfiles = Map.empty<Principal, UserProfile>();
  let mediaList = List.empty<MediaItem>();

  // Default Love Letter Template
  var loveLetterTemplate : Text = "Happy Valentine's Day, my love! \n\nI cherish every moment with you. Here's to many more memories together.";

  // Owner tracking - the creator of this Valentine's message
  var owner : ?Principal = null;

  // Helper function to check if caller is the owner
  func isOwner(caller : Principal) : Bool {
    switch (owner) {
      case (null) { false };
      case (?o) { Principal.equal(caller, o) };
    };
  };

  // Helper function to initialize owner on first modification
  func initializeOwner(caller : Principal) {
    switch (owner) {
      case (null) {
        // First person to modify content becomes the owner
        if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
          Runtime.trap("Unauthorized: Only authenticated users can create Valentine's messages");
        };
        owner := ?caller;
      };
      case (?_) {
        // Owner already set, do nothing
      };
    };
  };

  // User Profile Functions
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    // Authenticated users only
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    // Admins or the user themselves
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    // Authenticated users only
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // Bouquet Graphic URL
  public query ({ caller }) func getBouquetGraphic() : async Text {
    // Public access - anyone can view the bouquet graphic
    "https://api.instantdata.link/public/valentine-graphic.jpg";
  };

  // Media Management Functions

  // Add Media (Owner Only - Creator of the Valentine's message)
  public shared ({ caller }) func addMedia(id : Text, blob : Storage.ExternalBlob, mediaType : MediaType, description : Text, fileName : Text) : async Text {
    // Initialize owner if this is the first modification
    initializeOwner(caller);

    // Only the owner can add media
    if (not isOwner(caller)) {
      Runtime.trap("Unauthorized: Only the creator of this Valentine's message can add media");
    };

    let mediaItem : MediaItem = {
      id;
      blob;
      mediaType;
      description;
      fileName;
    };

    mediaList.add(mediaItem);
    id;
  };

  // Get All Media (Public Access - Anyone with the link can view)
  public query ({ caller }) func getAllMedia() : async [MediaItem] {
    // No authorization check - anyone with the link can view the media gallery
    // This allows the Valentine recipient and others to see the romantic message
    mediaList.toArray();
  };

  // Delete Media (Owner Only - Creator of the Valentine's message)
  public shared ({ caller }) func deleteMedia(id : Text) : async () {
    // Only the owner can delete media
    if (not isOwner(caller)) {
      Runtime.trap("Unauthorized: Only the creator of this Valentine's message can delete media");
    };

    let filteredMedia = mediaList.toArray().filter(
      func(item) {
        item.id != id;
      }
    );
    if (filteredMedia.size() == mediaList.size()) {
      Runtime.trap("Media not found");
    };
    mediaList.clear();
    mediaList.addAll(filteredMedia.values());
  };

  // Love Letter Management

  // Update Love Letter (Owner Only - Creator of the Valentine's message)
  public shared ({ caller }) func updateLoveLetter(newLetter : Text) : async () {
    // Initialize owner if this is the first modification
    initializeOwner(caller);

    // Only the owner can update the love letter
    if (not isOwner(caller)) {
      Runtime.trap("Unauthorized: Only the creator of this Valentine's message can update the love letter");
    };

    loveLetterTemplate := newLetter;
  };

  // Get Love Letter (Public Access - Anyone with the link can view)
  public query ({ caller }) func getLoveLetter() : async Text {
    // No authorization check - anyone with the link can view the letter
    // This allows the Valentine recipient to read the romantic message
    loveLetterTemplate;
  };

  // Get Owner (Query function for debugging/admin purposes)
  public query ({ caller }) func getOwner() : async ?Principal {
    // Only admins can query the owner
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can query the owner");
    };
    owner;
  };
};

