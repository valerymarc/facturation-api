<?php

namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;
use App\Repository\UserRepository;
use Doctrine\Common\Collections\Collection;
use ApiPlatform\Core\Annotation\ApiResource;
use Doctrine\Common\Collections\ArrayCollection;
use Symfony\Component\Serializer\Annotation\Groups;
use Symfony\Component\Validator\Constraints as Assert;
use Symfony\Component\Security\Core\User\UserInterface;
use Symfony\Bridge\Doctrine\Validator\Constraints\UniqueEntity;


/**
 * @ORM\Entity(repositoryClass=UserRepository::class)
 * @UniqueEntity("email", message="Un utilisateur ayant cet email existe déjà !")
 * @ApiResource(
 * normalizationContext={"groups"={"users_read"}}
 * )
 */
class User implements UserInterface
{
    /**
     * @ORM\Id
     * @ORM\GeneratedValue
     * @ORM\Column(type="integer")
     * @Groups({"clients_read", "factures_read", "users_read"})
     */
    private $id;

    /**
     * @ORM\Column(type="string", length=180, unique=true)
     * @Groups({"clients_read", "factures_read"})
     * @Assert\NotBlank(message="Renseignez l'email de l'utilisateur")
     * @Assert\Email(message="L'email '{{ value }}' n'est pas valide")
     */
    private $email;

    /**
     * @ORM\Column(type="json")
     * @Groups({"clients_read", "factures_read", "users_read"})
     */
    private $roles = [];

    /**
     * @var string The hashed password
     * @ORM\Column(type="string")
     * @Assert\NotBlank(message="Veuillez saisir un mot de passe valide")
     */
    private $password;

    /**
     * @ORM\Column(type="string", length=255)
     * @Groups({"clients_read", "factures_read", "users_read"})
     * @Assert\Length(
     * min=3, 
     * max=255,
     * minMessage="Le prénom doit contenir au moins {{ limit }} caractères",
     * maxMessage="Le prénom ne doit pas dépasser {{ limit }} caractères"
     * )
     * @Assert\NotBlank(message="Renseignez le prénom")
     */
    private $firstname;

    /**
     * @ORM\Column(type="string", length=255)
     * @Groups({"clients_read", "factures_read", "users_read"})
     * @Assert\Length(
     * min=3,
     * max=255,
     * minMessage="Le nom de famille doit contenir au moins {{ limit }} caractères",
     * maxMessage="Le nom de famille ne doit pas dépasser {{ limit }} caractères"
     * )
     * @Assert\NotBlank(message="Renseignez le nom de famille")
     */
    private $lastname;

    /**
     * @ORM\OneToMany(targetEntity=Client::class, mappedBy="user")
     */
    private $clients;

    public function __construct()
    {
        $this->clients = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
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

    /**
     * A visual identifier that represents this user.
     *
     * @see UserInterface
     */
    public function getUsername(): string
    {
        return (string) $this->email;
    }

    /**
     * @see UserInterface
     */
    public function getRoles(): array
    {
        $roles = $this->roles;
        // guarantee every user at least has ROLE_USER
        $roles[] = 'ROLE_USER';

        return array_unique($roles);
    }

    public function setRoles(array $roles): self
    {
        $this->roles = $roles;

        return $this;
    }

    /**
     * @see UserInterface
     */
    public function getPassword(): string
    {
        return (string) $this->password;
    }

    public function setPassword(string $password): self
    {
        $this->password = $password;

        return $this;
    }

    /**
     * Returning a salt is only needed, if you are not using a modern
     * hashing algorithm (e.g. bcrypt or sodium) in your security.yaml.
     *
     * @see UserInterface
     */
    public function getSalt(): ?string
    {
        return null;
    }

    /**
     * @see UserInterface
     */
    public function eraseCredentials()
    {
        // If you store any temporary, sensitive data on the user, clear it here
        // $this->plainPassword = null;
    }

    public function getFirstname(): ?string
    {
        return $this->firstname;
    }

    public function setFirstname(string $firstname): self
    {
        $this->firstname = $firstname;

        return $this;
    }

    public function getLastname(): ?string
    {
        return $this->lastname;
    }

    public function setLastname(string $lastname): self
    {
        $this->lastname = $lastname;

        return $this;
    }

    /**
     * @return Collection|Client[]
     */
    public function getClients(): Collection
    {
        return $this->clients;
    }

    public function addClient(Client $client): self
    {
        if (!$this->clients->contains($client)) {
            $this->clients[] = $client;
            $client->setUser($this);
        }

        return $this;
    }

    public function removeClient(Client $client): self
    {
        if ($this->clients->removeElement($client)) {
            // set the owning side to null (unless already changed)
            if ($client->getUser() === $this) {
                $client->setUser(null);
            }
        }

        return $this;
    }
}
