CREATE TABLE IF NOT EXISTS PERSON (
    idPerson SERIAL PRIMARY KEY,
    username VARCHAR(50) NOT NULL
);

CREATE TABLE IF NOT EXISTS FOLLOW (
    idFollower INTEGER NOT NULL,
    idFollowed INTEGER NOT NULL,

    CONSTRAINT pk_follow PRIMARY KEY (idFollower, idFollowed),
    CONSTRAINT fk_follow_person_follower FOREIGN KEY (idFollower) REFERENCES PERSON(idPerson),
    CONSTRAINT fk_follow_person_followed FOREIGN KEY (idFollowed) REFERENCES PERSON(idPerson)
);

CREATE TABLE IF NOT EXISTS PURCHASE (
    idPurchase SERIAL PRIMARY KEY,
    datePurchase DATE NOT NULL,
    idPerson INTEGER NOT NULL,

    CONSTRAINT fk_order_person FOREIGN KEY (idPerson) REFERENCES PERSON(idPerson)
);

CREATE TABLE IF NOT EXISTS PRODUCT (
    idProduct SERIAL PRIMARY KEY,
    productName VARCHAR(200) NOT NULL,
    reference VARCHAR(40) NOT NULL
);

CREATE TABLE IF NOT EXISTS PURCHASE_CONTENT (
    idProduct INTEGER NOT NULL,
    idPurchase INTEGER NOT NULL,
    quantity INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT pk_purchase_content PRIMARY KEY (idProduct, idPurchase),
    CONSTRAINT fk_purchase_content_product FOREIGN KEY (idProduct) REFERENCES PRODUCT(idProduct),
    CONSTRAINT fk_purchase_content_order FOREIGN KEY (idPurchase) REFERENCES PURCHASE(idPurchase)
);  