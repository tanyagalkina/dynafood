CREATE TABLE IF NOT EXISTS OAuthProvider
(
    oAuthProviderID uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    oAuthProviderName VARCHAR(20) NOT NULL
);

CREATE TABLE IF NOT EXISTS EndUser
(
    endUserID uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    firstName VARCHAR(20) NOT NULL,
    lastName VARCHAR(20) NOT NULL,
    userName VARCHAR(20) NOT NULL,
    email VARCHAR(50) NOT NULL UNIQUE,
    phoneNumber VARCHAR(20) NOT NULL,
    passcode VARCHAR(72) NOT NULL,
    emailConfirmed BOOLEAN NOT NULL,
    currentOAuthUserID uuid
);

CREATE TABLE IF NOT EXISTS OAuthUser
(
    oAuthUserID uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    endUserID uuid NOT NULL,
    oAuthProviderID uuid NOT NULL,
    userName VARCHAR(20) NOT NULL,
    pictureLink VARCHAR(512),
    userProviderEmail VARCHAR(50) NOT NULL,
    userProviderID VARCHAR(50) NOT NULL,
    CONSTRAINT fk_endUser
        FOREIGN KEY(endUserID)
            REFERENCES EndUser(endUserID)
            ON DELETE CASCADE,
    CONSTRAINT fk_provider
        FOREIGN KEY(oAuthProviderID)
            REFERENCES OAuthProvider(oAuthProviderID)
            ON DELETE CASCADE
);

ALTER TABLE EndUser ADD FOREIGN KEY (currentOAuthUserID) REFERENCES OAuthUser(oAuthUserID);

CREATE TABLE IF NOT EXISTS Addresses
(
    addressID uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    street VARCHAR(50) NOT NULL,
    addressAddidion VARCHAR(50) NOT NULL,
    houseNumber VARCHAR(10) NOT NULL,
    zipCode VARCHAR(15) NOT NULL,
    endUserID uuid NOT NULL,
    CONSTRAINT fk_endUser
        FOREIGN KEY(endUserID)
            REFERENCES EndUser(endUserID)
            ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS Restriction
(
    restrictionID uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    restrictionName VARCHAR(50) NOT NULL 
);

CREATE TABLE IF NOT EXISTS EndUser_Restriction
(
    connectionID uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    endUserID uuid NOT NULL,
    restrictionID uuid NOT NULL,
    CONSTRAINT fk_endUser
        FOREIGN KEY(endUserID)
            REFERENCES EndUser(endUserID)
            ON DELETE CASCADE,
    CONSTRAINT fk_restrictionID
        FOREIGN KEY(restrictionID)
            REFERENCES Restriction(restrictionID)
            ON DELETE CASCADE
);