<?php

namespace App\Entity;

use App\Entity\User;
use Doctrine\ORM\Mapping as ORM;
use App\Repository\FactureRepository;
use ApiPlatform\Core\Annotation\ApiFilter;
use ApiPlatform\Core\Annotation\ApiResource;
use Symfony\Component\Serializer\Annotation\Groups;
use ApiPlatform\Core\Bridge\Doctrine\Orm\Filter\OrderFilter;
use Symfony\Component\Validator\Constraints as Assert;

/**
 * @ORM\Entity(repositoryClass=FactureRepository::class)
 * @ApiResource(
 * subresourceOperations={
 *    "api_clients_factures_get_subresource"={
 *       "normalization_context"={
 *         "groups"={"factures_subresource"}
 *     }
 *   }
 * },
 * itemOperations={"GET", "PUT", "DELETE", "increment"={
 *     "method"="post", 
 *     "path"="/factures/{id}/increment",
 *     "controller"="App\Controller\FactureIncrementationController",
 *     "swagger_context"={
 *           "summary"="Incrémente une facture",
 *           "description"="Permet d'incrémenter la valeur chrono d'une facture donnée"
 *       }
 *    }
 * },
 * attributes={
 * "pagination_enabled"=true,
 * "pagination_items_per_page"=3,
 * "order":{"sentAt":"asc"}
 * },
 * normalizationContext={"groups"={"factures_read"}},
 * denormalizationContext={"disable_type_enforcement"=true}
 * )
 * @ApiFilter(OrderFilter::class, properties={"montant", "sentAt"})
 */
class Facture
{
    const CHOIX= ['PAYE', 'ENVOYE', 'ANNULE'];
    
    /**
     * @ORM\Id
     * @ORM\GeneratedValue
     * @ORM\Column(type="integer")
     * @Groups({"factures_read", "clients_read", "factures_subresource"})
     */
    private $id;

    /**
     * @ORM\Column(type="float")
     * @Groups({"factures_read", "clients_read", "factures_subresource"})
     * @Assert\NotBlank(message="Le montant de la facture est obligatoire")
     * @Assert\Type(type="numeric", message="Le montant de la facture doit être de type {{ type }}.")
     */
    private $montant;

    /**
     * @ORM\Column(type="datetime")
     * @Groups({"factures_read", "clients_read", "factures_subresource"})
     * @Assert\NotBlank(message="Date obligatoire")
     */
    private $sentAt;

    /**
     * @ORM\Column(type="string", length=255)
     * @Groups({"factures_read", "clients_read", "factures_subresource"})
     * @Assert\NotBlank(message="le statut est obligatoire")
     * @Assert\Choice(choices=Facture::CHOIX, message="Le statut doit avoir la valeur PAYE, ENVOYE ou ANNULE.")
     */
    private $statut;

    /**
     * @ORM\Column(type="integer")
     * @Groups({"factures_read", "clients_read", "factures_subresource"})
     * @Assert\NotBlank(message="Il faut absoulment un chrono pour la facture")
     * @Assert\Type(type="integer", message="Le chrono doite être de type {{ type }}")
     */
    private $chrono;

    /**
     * @ORM\ManyToOne(targetEntity=Client::class, inversedBy="factures")
     * @ORM\JoinColumn(nullable=false)
     * @Groups({"factures_read"})
     * @Assert\NotBlank(message="Le client de la facture doit être renseigné")
     */
    private $client;

    /**
     * Permet de recuperer le User à qui apprtient la facture
     * @Groups({"factures_read", "factures_subresource"})
     * @return User
     */
    public function getUser():User
    {
        return $this->client->getUser();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getMontant(): ?float
    {
        return $this->montant;
    }

    public function setMontant($montant): self
    {
        $this->montant = $montant;

        return $this;
    }

    public function getSentAt(): ?\DateTimeInterface
    {
        return $this->sentAt;
    }

    public function setSentAt($sentAt): self
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
