CREATE DATABASE quotes

--need extenstion
create extension if not exists "uuid-ossp";

CREATE TABLE users(
    user_id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_name VARCHAR(255) NOT NULL,
    user_email VARCHAR(255) NOT NULL,
    user_password VARCHAR(255) NOT NULL
);

CREATE TABLE quotes(
quote_id SERIAL,
user_id uuid NOT NULL,
quote VARCHAR(1000) NOT NULL,
author VARCHAR(250) NOT NULL,
notes VARCHAR(1000),
posting_date DATE NOT NULL DEFAULT CURRENT_DATE
);