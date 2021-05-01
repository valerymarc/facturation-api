<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20210427001813 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE user (id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, email VARCHAR(180) NOT NULL, roles CLOB NOT NULL --(DC2Type:json)
        , password VARCHAR(255) NOT NULL, firstname VARCHAR(255) NOT NULL, lastname VARCHAR(255) NOT NULL)');
        $this->addSql('CREATE UNIQUE INDEX UNIQ_8D93D649E7927C74 ON user (email)');
        $this->addSql('CREATE TEMPORARY TABLE __temp__client AS SELECT id, prenom, nom, email, company FROM client');
        $this->addSql('DROP TABLE client');
        $this->addSql('CREATE TABLE client (id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, user_id INTEGER DEFAULT NULL, prenom VARCHAR(255) NOT NULL COLLATE BINARY, nom VARCHAR(255) NOT NULL COLLATE BINARY, email VARCHAR(255) NOT NULL COLLATE BINARY, company VARCHAR(255) DEFAULT NULL COLLATE BINARY, CONSTRAINT FK_C7440455A76ED395 FOREIGN KEY (user_id) REFERENCES user (id) NOT DEFERRABLE INITIALLY IMMEDIATE)');
        $this->addSql('INSERT INTO client (id, prenom, nom, email, company) SELECT id, prenom, nom, email, company FROM __temp__client');
        $this->addSql('DROP TABLE __temp__client');
        $this->addSql('CREATE INDEX IDX_C7440455A76ED395 ON client (user_id)');
        $this->addSql('DROP INDEX IDX_FE86641019EB6921');
        $this->addSql('CREATE TEMPORARY TABLE __temp__facture AS SELECT id, client_id, montant, sent_at, statut, chrono FROM facture');
        $this->addSql('DROP TABLE facture');
        $this->addSql('CREATE TABLE facture (id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, client_id INTEGER NOT NULL, montant DOUBLE PRECISION NOT NULL, sent_at DATETIME NOT NULL, statut VARCHAR(255) NOT NULL COLLATE BINARY, chrono INTEGER NOT NULL, CONSTRAINT FK_FE86641019EB6921 FOREIGN KEY (client_id) REFERENCES client (id) NOT DEFERRABLE INITIALLY IMMEDIATE)');
        $this->addSql('INSERT INTO facture (id, client_id, montant, sent_at, statut, chrono) SELECT id, client_id, montant, sent_at, statut, chrono FROM __temp__facture');
        $this->addSql('DROP TABLE __temp__facture');
        $this->addSql('CREATE INDEX IDX_FE86641019EB6921 ON facture (client_id)');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('DROP TABLE user');
        $this->addSql('DROP INDEX IDX_C7440455A76ED395');
        $this->addSql('CREATE TEMPORARY TABLE __temp__client AS SELECT id, prenom, nom, email, company FROM client');
        $this->addSql('DROP TABLE client');
        $this->addSql('CREATE TABLE client (id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, prenom VARCHAR(255) NOT NULL, nom VARCHAR(255) NOT NULL, email VARCHAR(255) NOT NULL, company VARCHAR(255) DEFAULT NULL)');
        $this->addSql('INSERT INTO client (id, prenom, nom, email, company) SELECT id, prenom, nom, email, company FROM __temp__client');
        $this->addSql('DROP TABLE __temp__client');
        $this->addSql('DROP INDEX IDX_FE86641019EB6921');
        $this->addSql('CREATE TEMPORARY TABLE __temp__facture AS SELECT id, client_id, montant, sent_at, statut, chrono FROM facture');
        $this->addSql('DROP TABLE facture');
        $this->addSql('CREATE TABLE facture (id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, client_id INTEGER NOT NULL, montant DOUBLE PRECISION NOT NULL, sent_at DATETIME NOT NULL, statut VARCHAR(255) NOT NULL, chrono INTEGER NOT NULL)');
        $this->addSql('INSERT INTO facture (id, client_id, montant, sent_at, statut, chrono) SELECT id, client_id, montant, sent_at, statut, chrono FROM __temp__facture');
        $this->addSql('DROP TABLE __temp__facture');
        $this->addSql('CREATE INDEX IDX_FE86641019EB6921 ON facture (client_id)');
    }
}
