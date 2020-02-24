using System;
using System.ComponentModel.DataAnnotations;

namespace ProjetoFilme.Models
{
    public class Genre
    {
        public int ID { get; set; }

        [MaxLength(100)]
        [Required]
        public string Nome { get; set; }

        public DateTime DataCriacao { get; set; }

        public bool Ativo { get; set; }
    }
}