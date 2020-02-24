using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ProjetoFilme.Models
{
    public class Film
    {
        public int ID { get; set; }

        [MaxLength(200)]
        [Required]
        public string Nome { get; set; }

        public DateTime DataCriacao { get; set; }

        public bool Ativo { get; set; }

        [Required]
        public int GeneroID { get; set; }

        [ForeignKey("GeneroID")]
        public virtual Genre Genero { get; set; }
    }
}