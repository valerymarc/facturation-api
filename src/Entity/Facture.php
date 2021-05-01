<?php

namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;
use App\Repository\FactureRepository;
use ApiPlatform\Core\Annotation\ApiFilter;
use ApiPlatform\Core\Annotation\ApiResource;
use Symfony\Component\Serializer\Annotation\Groups;
use ApiPlatform\Core\Bridge\Doctrine\Orm\Filter\OrderFilter;

/**
 * @ORM\Entity(repositoryClass=FactureRepository::class)
 * @ApiResource(
 * attributes={
 * "pagination_enabled"=true,
 * "pagination_items_per_page"=3,
 * "order":{"sentAt":"asc"}
 * },
 * normalizationContext={
 * "groups"={"factures_read"}
 * }
 * )
 * @ApiFilter(OrderFilter::class, properties={"montant", "sentAt"})
 */
class Facture
{
    /**
     * @ORM\Id
     * @ORM\GeneratedValue
     * @ORM\Column(type="integer")
     * @Groups({"factures_read", "clients_read"})
     */
    private $id;

    /**
     * @ORM\Column(type="float")
     * @Groups({"factures_read", "clients_read"})
     */
    private $montant;

    /**
     * @ORM\Column(type="datetime")
     * @Groups({"factures_read", "clients_read"})
     */
    private $sentAt;

    /**
     * @ORM\Column(type="string", length=255)
     * @Groups({"factures_read", "clients_read"})
     */
    private $statut;

    /**
     * @ORM\Column(type="integer")
     * @Groups({"factures_read", "clients_read"})
     */
    private $chrono;

    /**
     * @ORM\ManyToOne(targetEntity=Client::class, inversedBy="factures")
     * @ORM\JoinColumn(nullable=false)
     * @Groups({"factures_read"})
     */
    private $client;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getMontant(): ?float
    {
        return $this->montant;
    }

    public function setMontant(float $montant): self
    {
        $this->montant = $montant;

        return $this;
    }

    public function getSentAt(): ?\DateTimeInterface
    {
        return $this->sentAt;
    }

    public function setSentAt(\DateTimeInterface $sentAt): self
    {
        $this->sentAt = $sentAt;

        return $this;
    }

    public function getStatut(): ?string
    {
        return $this->statut;
    }

    public function setStatut(string $statut): self
    {
        $this->statut = $statut;

        return $this;
    }

    public function getChrono(): ?int
    {
        return $this->chrono;
    }

    public function setChrono(int $chrono): self
    {
        $this->chrono = $chrono;

        return $this;
    }

    public function getClient(): ?Client
    {
        return $this->client;
    }

    public function setClient(?Client $client): self
    {
        $this->client = $client;

        return $this;
    }
}
