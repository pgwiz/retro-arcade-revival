import Text "mo:base/Text";

actor {
  public query func getVersion() : async Text {
    "0.1.0"
  };

  public query func getStatus() : async Text {
    "Retro Arcade Revival backend active"
  };
};
