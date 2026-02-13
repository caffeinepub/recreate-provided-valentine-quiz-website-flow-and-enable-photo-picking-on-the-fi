import MixinStorage "blob-storage/Mixin";
import Storage "blob-storage/Storage";
import List "mo:core/List";
import Runtime "mo:core/Runtime";
import Map "mo:core/Map";
import Principal "mo:core/Principal";
import Migration "migration";

import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

(with migration = Migration.run)
actor {
  include MixinStorage();

  // Access control state
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

  // Updated correct love letter template
  var loveLetterTemplate : Text = "My beloved Marianne,\n\nFor the longest time, I was filled with memories from a previous relationship. These memories used to cloud my present. But one day that changed. At some point, I realized that I was no longer thinking about Marina. Every time we spend time together, every time we just watch TV, I feel like I fall more and more in love with you. Now, even cloudy days become the brightest, happiest, and most serene time of my day, because I get to spend it with you. I cherish every moment with you and wouldn't trade it for anything.\n\nIt's been an incredible blessing, and I want to thank you.\n\nI love you more than anything, more than anyone else could ever understand. If you still ask me \"Do you love me?\", in my opinion, it's in the running for \"Best rhetorical question of the year.\"\n\nIt's funny how things work. What you may not realize is that even just being with you, by your side, makes me feel valiant, strong, worthy, and loved. You give me a sense of purpose in my life.\n\nAll I want is for us to be together and become even more connected to each other. I want us to explore all nuances of love and discover the depths of our emotional bond so that our souls become the most intense and profound reflection of each other. A loving partnership can transcend all boundaries, giving people a second chance to live a deeply meaningful life—Emotionally, spiritually, and physically a fulfilling, passionate union that we can truly rely on. Especially when it gets hard ❤️.\n\nBest,\nNikita";

  var owner : ?Principal = null;

  // Checks if caller is the owner
  func isOwner(caller : Principal) : Bool {
    switch (owner) {
      case (null) { false };
      case (?o) { Principal.equal(caller, o) };
    };
  };

  // Sets owner on first modification
  func initializeOwner(caller : Principal) {
    switch (owner) {
      case (null) {
        if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
          Runtime.trap("Unauthorized: Only authenticated users can create Valentine's messages");
        };
        owner := ?caller;
      };
      case (?_) {};
    };
  };

  // User Profile Functions
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access profiles");
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

  // Bouquet Graphic URL - Public access (no auth required)
  public query func getBouquetGraphic() : async Text {
    "https://api.instantdata.link/public/valentine-graphic.jpg";
  };

  // Media Management Functions
  public shared ({ caller }) func addMedia(id : Text, blob : Storage.ExternalBlob, mediaType : MediaType, description : Text, fileName : Text) : async Text {
    initializeOwner(caller);

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

  // Public access - anyone can view the Valentine's media (including guests)
  public query func getAllMedia() : async [MediaItem] {
    mediaList.toArray();
  };

  public shared ({ caller }) func deleteMedia(id : Text) : async () {
    if (not isOwner(caller)) {
      Runtime.trap("Unauthorized: Only the creator of this Valentine's message can delete media");
    };
    let filteredMedia = mediaList.toArray().filter(func(item) { item.id != id });
    if (filteredMedia.size() == mediaList.size()) {
      Runtime.trap("Media not found");
    };
    mediaList.clear();
    mediaList.addAll(filteredMedia.values());
  };

  // Love Letter Management
  public shared ({ caller }) func updateLoveLetter(newLetter : Text) : async () {
    initializeOwner(caller);

    if (not isOwner(caller)) {
      Runtime.trap("Unauthorized: Only the creator of this Valentine's message can update the love letter");
    };

    loveLetterTemplate := newLetter;
  };

  // Public access - anyone can read the love letter (including guests)
  public query func getLoveLetter() : async Text {
    loveLetterTemplate;
  };

  // Public access - anyone can see the author name
  public query func getLoveLetterAuthor() : async Text {
    "Nikita Voronin";
  };

  // Admin-only function to query ownership
  public query ({ caller }) func getOwner() : async ?Principal {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can query the owner");
    };
    owner;
  };
};

