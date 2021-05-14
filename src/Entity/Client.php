<?php

namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;
use App\Repository\ClientRepository;
use ApiPlatform\Core\Annotation\ApiFilter;
use Doctrine\Common\Collections\Collection;
use ApiPlatform\Core\Annotation\ApiResource;
use ApiPlatform\Core\Annotation\ApiSubresource;
use Doctrine\Common\Collections\ArrayCollection;
use Symfony\Component\Serializer\Annotation\Groups;
use Symfony\Component\Validator\Constraints as Assert;
use ApiPlatform\Core\Bridge\Doctrine\Orm\Filter\OrderFilter;
use ApiPlatform\Core\Bridge\Doctrine\Orm\Filter\SearchFilter;

/**
 * @ORM\Entity(repositoryClass=ClientRepository::class)
 * @ApiResource(
 * collectionOperations={"GET", "POST"},
 * itemOperations={"GET", "PUT", "DELETE"},
 * subresourceOperations={
 *   "factures_get_subresource"={"path"="/clients/{id}/factures"}
 * },
 * normalizationContext={
 * "groups"={"clients_read"}
 * }
 * )
 * @ApiFilter(SearchFilter::class, properties={"prenom":"partial", "nom", "company"})
 * @ApiFilter(OrderFilter::class)
 */
class Client
{
    /**
     * @ORM\Id
     * @ORM\GeneratedValue
     * @ORM\Column(type="integer")
     * @Groups({"clients_read", "factures_read"})
     */
    private $id;

    /**
     * @ORM\Column(type="string", length=255)
     * @Groups({"clients_read", "factures_read"})
     * @Assert\Length(
     * min=3,
     * max=255,
     * minMessage="Le prénom doit contenir au moins {{ limit }} caractères",
     * maxMessage="Le prénom ne doit pas dépasser {{ limit }} caractères"
     * )
     * @Assert\NotBlank(message="Le prénom du client est obligatoire")
     */
    private $prenom;

    /**
     * @ORM\Column(type="string", length=255)
     * @Groups({"clients_read", "factures_read"})
     * @Assert\Length(
     * min=3,
     * max=255,
     * minMessage="Le nom de famille du client doit contenir au moins {{ limit }} caractères",
     * maxMessage="Le nom de famille du client  ne doit pas dépasser {{ limit }} caractères"
     * )
     * @Assert\NotBlank(message="Le nom de famille du client est obligatoire")
     */
    private $nom;

    /**
     * @ORM\Column(type="string", length=255)
     * @Groups({"clients_read", "factures_read"})
     * @Assert\NotBlank(message="L'adresse email du client est obligatoire")
     * @Assert\Email(message="L'adresse {{ value }} n'est pas un email valide")
     */
    private $email;

    /**
     * @ORM\Column(type="string", length=255, nullable=true)
     * @Groups({"clients_read", "factures_read"})
     */
    private $company;

    /**
     * @ORM\OneToMany(targetEntity=Facture::class, mappedBy="client")
     * @Groups({"clients_read"})
     * @ApiSubresource
     */
    private $factures;

    /**
     * @ORM\ManyToOne(targetEntity=User::class, inversedBy="clients")
     * @Groups({"clients_read"})
     * @Assert\NotBlank(message="Vous devez indiquer un utilisateur")
     */
    private $user;

    public function __construct()
    {
        $this->factures = new ArrayCollection();
    }


    /**
     * Fonction permettant de retourner le montant total des factures d'un client
     * @Groups({"clients_read"})
     * @return float
     */
    public function getTotalMontant():float
    {
        return array_reduce($this->factures->toArray(), function ($total, $facture){
           return $total + $facture->getMontant();
        }, 0);
    }


    /**
     * Récupérer le montant total non payé (hors factures payé ou annulé)
     * @Groups({"clients_read"})
     * @return float
     */
    public function getMontantImpaye():float
    {
        return array_reduce($this->factures->toArray(), function($total, $facture){
           return $total + ($facture->getStatut() === "PAYE" || $facture->getStatut() === "ANNULE" ? 0 : $facture->getMontant());
        }, 0);
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getPrenom(): ?string
    {
        return $this->prenom;
    }

    public function setPrenom(string $prenom): self
    {
        $this->prenom = $prenom;

        return $this;
    }

    public function getNom(): ?string
    {
        return $this->nom;
    }

    public function setNom(string $nom): self
    {
        $this->nom = $nom;

        return $this;
    }

    public function getEmail(): ?string
    {
        return $this->email;
    }

    public function setEmail(string $email): self
    {
        $this->email = $email;

        return $this;
    }

    public function getCompany(): ?string
    {
        return $this->company;
    }

    public function setCompany(?string $company): self
    {
        $this->company = $company;

        return $this;
    }

    /**
     * @return Collection|Facture[]
     */
    public function getFactures(): Collection
    {
        return $this->factures;
    }

    public function addFacture(Facture $facture): self
    {
        if (!$this->factures->contains($facture)) {
            $this->factures[] = $facture;
            $facture->setClient($this);
        }

        return $this;
    }

    public function removeFacture(Facture $facture): self
    {
        if ($this->factures->removeElement($facture)) {
            // set the owning side to null (unless already changed)
            if ($facture->getClient() === $this) {
                $facture->setClient(null);
            }
        }

        return $this;
    }

    public function getUser(): ?User
    {
        return $this->user;
    }

    public function setUser(?User $user): self
    {
        $this->user = $user;

        return $this;
    }
}
