import MixinStorage "blob-storage/Mixin";
import Storage "blob-storage/Storage";
import List "mo:core/List";
import Runtime "mo:core/Runtime";
import Map "mo:core/Map";
import Principal "mo:core/Principal";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";
import Migration "migration";

(with migration = Migration.run)
actor {
  // Initialize the user system state.
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  include MixinStorage();

  // Media Types.
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

  let mediaList = List.empty<MediaItem>();

  var loveLetter : Text = "";

  // User profile type as required by frontend.
  public type UserProfile = {
    name : Text;
  };

  let userProfiles = Map.empty<Principal, UserProfile>();

  // User profile management functions.
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

  // Public query functions - no authorization needed for reading.
  public query func getAllMedia() : async [MediaItem] {
    mediaList.toArray();
  };

  public query func getLoveLetter() : async Text {
    loveLetter;
  };

  public query func getLoveLetterAuthor() : async Text {
    "Nikita Voronin";
  };

  public query func getBouquetGraphic() : async Text {
    "https://api.instantdata.link/public/valentine-graphic.jpg";
  };

  // Admin-only function to save the love letter text.
  // Since there is one canonical love letter with a specific author,
  // only admins should be able to modify it.
  public shared ({ caller }) func saveLoveLetter(newLoveLetter : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can save the love letter");
    };
    loveLetter := newLoveLetter;
  };
};
