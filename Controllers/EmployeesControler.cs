using Microsoft.AspNetCore.Mvc;
using System.Globalization;
using System.Text;

namespace Toni_Valev_employees.Controllers
{
    [ApiController]
    [Route("employees/upload")]
    public class EmployeesControler : ControllerBase
    {
        private readonly ILogger<EmployeesControler> _logger;

        public EmployeesControler(ILogger<EmployeesControler> logger)
        {
            _logger = logger;
        }

        [HttpPost(Name = "PostEmployees")]
        public async Task<IActionResult> Post()
        {
            if (!Request.HasFormContentType || !Request.Form.Files.Any())
                return Ok(new
                {
                    Employees = Enumerable.Empty<Employee>(),
                    LongestWorkingPairs = Enumerable.Empty<object>(),
                    AllPairs = Enumerable.Empty<object>()
                });

            var file = Request.Form.Files[0];
            var employees = new List<Employee>();

            using (var stream = file.OpenReadStream())
            using (var reader = new StreamReader(stream, Encoding.UTF8))
            {
                string? line;
                while ((line = await reader.ReadLineAsync()) != null)
                {
                    // Skip empty lines or header
                    if (string.IsNullOrWhiteSpace(line) || line.StartsWith("EmpID", StringComparison.OrdinalIgnoreCase))
                        continue;

                    var parts = line.Split(',');
                    if (parts.Length < 4)
                        continue;

                    int empId = 0, projectId = 0;
                    DateOnly dateFrom = default, dateTo = default;

                    if (int.TryParse(parts[0], out empId) &&
                        int.TryParse(parts[1], out projectId))
                    {
                        bool validDateFrom = false, validDateTo = false;

                        if (parts[2].Trim().Equals("NULL", StringComparison.OrdinalIgnoreCase))
                        {
                            dateFrom = DateOnly.FromDateTime(DateTime.Today);
                            validDateFrom = true;
                        }
                        else
                        {
                            string[] dateFormats = new[]
                            {
                                "yyyy-MM-dd", "MM/dd/yyyy", "dd/MM/yyyy", "M/d/yyyy", "d/M/yyyy",
                                "yyyy/MM/dd", "dd-MM-yyyy", "MM-dd-yyyy", "d-M-yyyy", "M-d-yyyy",
                                "yyyyMMdd", "ddMMyyyy", "MMddyyyy"
                            };

                            if (parts[2].Trim().Equals("NULL", StringComparison.OrdinalIgnoreCase))
                            {
                                dateFrom = DateOnly.FromDateTime(DateTime.Today);
                                validDateFrom = true;
                            }
                            else
                            {
                                validDateFrom = DateOnly.TryParseExact(parts[2].Trim(), dateFormats, CultureInfo.InvariantCulture, DateTimeStyles.None, out dateFrom);
                            }

                            if (parts[3].Trim().Equals("NULL", StringComparison.OrdinalIgnoreCase))
                            {
                                dateTo = DateOnly.FromDateTime(DateTime.Today);
                                validDateTo = true;
                            }
                            else
                            {
                                validDateTo = DateOnly.TryParseExact(parts[3].Trim(), dateFormats, CultureInfo.InvariantCulture, DateTimeStyles.None, out dateTo);
                            }
                        }

                        if (parts[3].Trim().Equals("NULL", StringComparison.OrdinalIgnoreCase))
                        {
                            dateTo = DateOnly.FromDateTime(DateTime.Today);
                            validDateTo = true;
                        }
                        else
                        {
                            validDateTo = DateOnly.TryParseExact(parts[3], "yyyy-MM-dd", CultureInfo.InvariantCulture, DateTimeStyles.None, out dateTo);
                        }

                        if (validDateFrom && validDateTo)
                        {
                            employees.Add(new Employee
                            {
                                EmpID = empId,
                                ProjectID = projectId,
                                DateFrom = dateFrom,
                                DateTo = dateTo
                            });
                        }
                    }
                }
            }

            // Find pairs who worked together on common projects and calculate days worked together
            var pairs = new List<(int Emp1, int Emp2, int ProjectId, int DaysWorked)>();

            var groupedByProject = employees.GroupBy(e => e.ProjectID);

            foreach (var projectGroup in groupedByProject)
            {
                var empList = projectGroup.ToList();
                for (int i = 0; i < empList.Count; i++)
                {
                    for (int j = i + 1; j < empList.Count; j++)
                    {
                        var empA = empList[i];
                        var empB = empList[j];

                        var overlapStart = empA.DateFrom > empB.DateFrom ? empA.DateFrom : empB.DateFrom;
                        var overlapEnd = empA.DateTo < empB.DateTo ? empA.DateTo : empB.DateTo;

                        if (overlapStart <= overlapEnd)
                        {
                            int daysWorked = (overlapEnd.DayNumber - overlapStart.DayNumber) + 1;
                            pairs.Add((empA.EmpID, empB.EmpID, projectGroup.Key, daysWorked));
                        }
                    }
                }
            }

            // Find the maximum days worked together
            int maxDays = pairs.Any() ? pairs.Max(p => p.DaysWorked) : 0;
            var longestPairs = pairs
                .Where(p => p.DaysWorked == maxDays && maxDays > 0)
                .Select(p => new
                {
                    EmployeeID1 = p.Emp1,
                    EmployeeID2 = p.Emp2,
                    ProjectID = p.ProjectId,
                    DaysWorked = p.DaysWorked
                })
                .ToList();

            var allPairs = pairs
                .Where(p => p.DaysWorked > 0)
                .Select(p => new
                {
                    EmployeeID1 = p.Emp1,
                    EmployeeID2 = p.Emp2,
                    ProjectID = p.ProjectId,
                    DaysWorked = p.DaysWorked
                })
                .ToList();

            return Ok(new
            {
                Employees = employees,
                LongestWorkingPairs = longestPairs,
                AllPairs = allPairs,
            });
        }
    }
}