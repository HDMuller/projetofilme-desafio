using ProjetoFilme.Models;
using System.Data.Entity;

namespace ProjetoFilme.Data
{
    // Sobre a criação do banco com Code First
    // No momento que a API rodar pela primeira vez, o banco não existirá, dessa maneira o Entity Framework Code First irá criar um banco de dados com as classes que estão aqui definidas.
    // Além disso, cada classe determina as especificações das propriedades, como [required], tipo da variável(varchar), relacionamentos entre as entidades, entre outras definições que as propriedades podem ter.

    // Parte do Rollback das transações para o Entity Framework:
    // Pesquisei sobre o SaveChanges() do EF, segue o link do MSDN:
    // https://docs.microsoft.com/pt-br/ef/ef6/saving/transactions
    // Onde diz:
    // "O que o EF faz por padrão:
    // Em todas as versões do Entity Framework, sempre que você executar SaveChanges() para inserir, atualizar ou excluir no banco de dados,
    // a estrutura encapsulará essa operação em uma transação. Essa transação dura apenas o tempo suficiente para executar a operação e,
    // em seguida, é concluída. Quando você executa outra operação, uma nova transação é iniciada."
    // Dessa maneira, quando o SaveChanges() por alguma razão não consegue salvar as modificações no banco de dados,
    // como ele está encapsulado em uma Transaction que garante o termo "ACID", o rollback é feito por default.
    // Bonus: Segue o link de um Post falando sobre o assunto, e recomendando não utilizar um rollback personalizado com Entity Framework
    // Os comentários no Post são bem relevantes também.
    public class DataDbContext : DbContext
    {
        public DbSet<Film> Films { get; set; }

        public DbSet<User> Users { get; set; }

        public DbSet<Genre> Genres { get; set; }

        public DbSet<Lease> Leases { get; set; }
    }
}