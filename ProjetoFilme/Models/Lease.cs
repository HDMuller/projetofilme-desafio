using System;
using System.ComponentModel.DataAnnotations;

namespace ProjetoFilme.Models
{
    public class Lease
    {
        public int ID { get; set; }

        [MaxLength(14)]
        [Required]
        public string CPF { get; set; }

        // Aqui caberia um relacionamento N:N, através de outra tabela, relacionando as locações e os filmes.
        // Entretanto, para manter a simplicidade do projeto optei por desenvolver dessa maneira e fazer os devidos tratamentos no front do sistema.
        [Required]
        public string Filmes { get; set; }

        public DateTime DataLocacao { get; set; }
    }
}