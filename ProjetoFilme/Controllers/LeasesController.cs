using Dapper;
using ProjetoFilme.Models;
using System.Configuration;
using System.Data.SqlClient;
using System.Net;
using System.Transactions;
using System.Web.Http;

namespace ProjetoFilme.Controllers
{
    public class LeasesController : ApiController
    {
        // Pega a stringConnection do Web.Config
        static string strConexao = ConfigurationManager.ConnectionStrings["DataDbContext"].ConnectionString;

        // GET api/leases
        // Método para pegar todas as locações
        public IHttpActionResult Get()
        {
            // Cria uma conexão e utiliza ela dentro do bloco using
            using (var connection = new SqlConnection(strConexao))
            {
                // Pega as entidades e retorna
                var entities = connection.Query<Lease>(@"SELECT * FROM Leases");
                return Ok(entities);
            }
        }

        // GET api/leases/:id
        // Método para pegar uma locação especifica, por ID
        public IHttpActionResult Get(int id)
        {
            // Cria uma conexão e utiliza ela dentro do bloco using
            using (var connection = new SqlConnection(strConexao))
            {
                // Pega a locação pelo ID
                var entity = connection.QueryFirstOrDefault<Lease>(@"SELECT * FROM Leases WHERE ID = @Id", new { Id = id });
                // Valida se encontrou
                if (entity == null)
                {
                    return BadRequest("Nenhuma entidade encontrada com este id");
                }
                // Retorna a entidade
                return Ok(entity);
            }
        }

        // POST api/leases
        // Método para salvar uma nova locação
        public IHttpActionResult Post([FromBody]Lease entity)
        {
            // Cria uma transação (para garantir o "ACID") e utiliza ela dentro do bloco using
            using (TransactionScope scope = new TransactionScope())
            // Cria uma conexão e utiliza ela dentro do bloco using
            using (var connection = new SqlConnection(strConexao))
            {
                try
                {
                    // Adiciona no banco de dados
                    connection.Execute(@"INSERT Leases(CPF, Filmes, DataLocacao)
                                    VALUES (@CPF, @Filmes, @DataLocacao)", entity);
                    // Completa a transação, salvando as mudanças no banco de dados
                    scope.Complete();
                    return StatusCode(HttpStatusCode.Created);
                }
                catch (System.Exception ex)
                {
                    // Não é necessário nenhum rollback
                    // Se não é chamado Complete(),
                    // um rollback é automatico quando sair do bloco using
                    // Referência: https://stackoverflow.com/questions/36186691/how-to-rollback-a-transaction-using-dapper
                    return BadRequest("Não foi possível cadastrar a entidade:" + ex.Message);
                }
            }
        }

        // PUT api/leases/5
        // Método para atualizar uma locação existente, passando o ID a ser atualizado, e o objeto para atualizar
        public IHttpActionResult Put(int id, [FromBody]Lease value)
        {
            // Cria uma transação (para garantir o "ACID") e utiliza ela dentro do bloco using
            using (TransactionScope scope = new TransactionScope())
            // Cria uma conexão e utiliza ela dentro do bloco using
            using (var connection = new SqlConnection(strConexao))
            {
                try
                {
                    // Pega a transação do banco de dados
                    var entity = connection.QueryFirstOrDefault<Lease>(@"SELECT * FROM Leases WHERE ID = @Id", new { Id = id });
                    // Valida se encontrou
                    if (entity == null)
                    {
                        return BadRequest("Nenhuma entidade encontrada com este id");
                    }
                    // Atualiza os dados na entidade
                    entity.CPF = value.CPF;
                    entity.Filmes = value.Filmes;
                    entity.DataLocacao = value.DataLocacao;
                    // Realiza as alterações feitas na entidade no banco de dados
                    connection.Execute(@"UPDATE Leases SET CPF = @CPF, Filmes = @Filmes, DataLocacao = @DataLocacao WHERE ID = @ID", entity);
                    // Completa a transação, salvando as mudanças no banco de dados
                    scope.Complete();
                    return Ok("Locação atualizada com sucesso.");
                }
                catch (System.Exception ex)
                {
                    // Não é necessário nenhum rollback
                    // Se não é chamado Complete(),
                    // um rollback é automatico quando sair do bloco using
                    // Referência: https://stackoverflow.com/questions/36186691/how-to-rollback-a-transaction-using-dapper
                    return BadRequest("Não foi possível cadastrar a entidade:" + ex.Message);
                }
            }
        }

        // DELETE api/leases/:id
        // Método para deletar uma locação
        public IHttpActionResult Delete(int id)
        {
            // Cria uma transação (para garantir o "ACID") e utiliza ela dentro do bloco using
            using (TransactionScope scope = new TransactionScope())
            // Cria uma conexão e utiliza ela dentro do bloco using
            using (var connection = new SqlConnection(strConexao))
            {
                try
                {
                    // Pega a entidade do banco de dados
                    var entity = connection.QueryFirstOrDefault<Lease>(@"SELECT * FROM Leases WHERE ID = @Id", new { Id = id });
                    // Valida se encontrou
                    if (entity == null)
                    {
                        return BadRequest("Nenhuma entidade encontrada com este id");
                    }
                    // Realiza a exclusão da enitdade no banco de dados
                    connection.Execute(@"DELETE FROM Leases WHERE ID=@Id;", new { Id = id });
                    // Salva as mudanças feitas no banco de dados
                    scope.Complete();
                    // Retorna que a locação foi deletada
                    return Ok("Locação deletado.");
                }
                catch (System.Exception ex)
                {
                    // Não é necessário nenhum rollback
                    // Se não é chamado Complete(),
                    // um rollback é automatico quando sair do bloco using
                    // Referência: https://stackoverflow.com/questions/36186691/how-to-rollback-a-transaction-using-dapper
                    return BadRequest("Não foi possível cadastrar a entidade:" + ex.Message);
                }
            }
        }
    }
}
