CREATE TABLE IF NOT EXISTS PERSON (
    idPerson SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL
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
    reference VARCHAR(40) UNIQUE NOT NULL
);

CREATE TABLE IF NOT EXISTS PURCHASE_CONTENT (
    idProduct INTEGER NOT NULL,
    idPurchase INTEGER NOT NULL,
    quantity INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT pk_purchase_content PRIMARY KEY (idProduct, idPurchase),
    CONSTRAINT fk_purchase_content_product FOREIGN KEY (idProduct) REFERENCES PRODUCT(idProduct),
    CONSTRAINT fk_purchase_content_order FOREIGN KEY (idPurchase) REFERENCES PURCHASE(idPurchase)
);  

SELECT reference, COUNT(1)
FROM PRODUCT
INNER JOIN PURCHASE_CONTENT ON PRODUCT.idProduct = PURCHASE_CONTENT.idProduct
INNER JOIN PURCHASE ON PURCHASE_CONTENT.idPurchase = PURCHASE.idPurchase
GROUP BY reference

SELECT p2.idPerson, p2.username 
FROM PERSON p1
INNER JOIN FOLLOW f ON p1.idPerson = f.idFollowed
INNER JOIN PERSON p2 ON p2.idPerson = f.idFollower
WHERE p1.idPerson = 2;

WITH RECURSIVE followers AS (
	SELECT
	    idPerson,
		username
	FROM
		PERSON p1  
	WHERE
		p1.username = 'Person 98'
        
	UNION
		SELECT
            idPerson,
            username
		FROM
			PERSON p2 
        INNER JOIN FOLLOW f ON f.idFollower = p2.idPerson
		INNER JOIN followers ON followers.idPerson = f.idFollowed
)
SELECT
	*
FROM
	followers;