CREATE TABLE rki.bundeslaender (
   id serial PRIMARY KEY,
   b_idbundesland  integer UNIQUE,
   b_bundesland  varchar(100),
   b_einwohner  integer
);

CREATE TABLE rki.covid19 (
   id serial PRIMARY KEY,
   c_anzahlfall  integer,
   c_anzahltodesfall  integer,
   c_summefall  integer,
   c_summetodesfall  integer,
   c_meldedatum date,
   c_bundesland  varchar(100),
   fk_b_idbundesland  integer NOT NULL CONSTRAINT constraint_fk_b_idbundesland REFERENCES rki.bundeslaender(b_idbundesland),
   c_genesung  integer,
   c_summegenesung  integer,
   c_restinfiziert  integer,
   c_summerestinfiziert  integer
);
CREATE INDEX idx_fk_b_idbundesland ON rki.covid19 (fk_b_idbundesland);
