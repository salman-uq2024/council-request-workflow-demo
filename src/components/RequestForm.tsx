import { FormEvent, useState } from 'react';
import { RequestCategory, RequestFormValues, RequestPriority } from '../types';

interface RequestFormProps {
  onSubmit: (values: RequestFormValues) => void;
}

const categories: RequestCategory[] = [
  'Access / Permissions',
  'Application Support',
  'Business Process Automation',
  'Data / Reporting',
  'Infrastructure',
  'Service Desk',
];

const priorities: RequestPriority[] = ['Low', 'Medium', 'High'];

const initialValues: RequestFormValues = {
  title: '',
  category: 'Business Process Automation',
  description: '',
  department: '',
  location: '',
  priority: 'Medium',
  requesterName: '',
  requesterEmail: '',
};

export function RequestForm({ onSubmit }: RequestFormProps) {
  const [values, setValues] = useState<RequestFormValues>(initialValues);

  function handleFormSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    onSubmit(values);
    setValues(initialValues);
  }

  return (
    <section className="panel">
      <div className="panel-header">
        <div>
          <p className="eyebrow">New Request</p>
          <h2>Internal service request submission</h2>
        </div>
        <p className="panel-intro">
          Designed for business units to log automation, access, application,
          or reporting requests with clear ownership and priority.
        </p>
      </div>

      <form className="form-grid" onSubmit={handleFormSubmit}>
        <label>
          Request title
          <input
            required
            value={values.title}
            onChange={(event) =>
              setValues((current) => ({ ...current, title: event.target.value }))
            }
            placeholder="Example: Automate invoice reconciliation alerts"
          />
        </label>

        <label>
          Category
          <select
            value={values.category}
            onChange={(event) =>
              setValues((current) => ({
                ...current,
                category: event.target.value as RequestCategory,
              }))
            }
          >
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </label>

        <label>
          Requesting department
          <input
            required
            value={values.department}
            onChange={(event) =>
              setValues((current) => ({
                ...current,
                department: event.target.value,
              }))
            }
            placeholder="Example: Infrastructure and Environment"
          />
        </label>

        <label>
          Site / location
          <input
            required
            value={values.location}
            onChange={(event) =>
              setValues((current) => ({ ...current, location: event.target.value }))
            }
            placeholder="Example: Ipswich Civic Centre"
          />
        </label>

        <label>
          Priority
          <select
            value={values.priority}
            onChange={(event) =>
              setValues((current) => ({
                ...current,
                priority: event.target.value as RequestPriority,
              }))
            }
          >
            {priorities.map((priority) => (
              <option key={priority} value={priority}>
                {priority}
              </option>
            ))}
          </select>
        </label>

        <label>
          Requester name
          <input
            required
            value={values.requesterName}
            onChange={(event) =>
              setValues((current) => ({
                ...current,
                requesterName: event.target.value,
              }))
            }
            placeholder="Example: Jordan Richards"
          />
        </label>

        <label>
          Requester email
          <input
            required
            type="email"
            value={values.requesterEmail}
            onChange={(event) =>
              setValues((current) => ({
                ...current,
                requesterEmail: event.target.value,
              }))
            }
            placeholder="name@ipswich.demo"
          />
        </label>

        <label className="full-width">
          Business context and desired outcome
          <textarea
            required
            rows={5}
            value={values.description}
            onChange={(event) =>
              setValues((current) => ({
                ...current,
                description: event.target.value,
              }))
            }
            placeholder="Describe the current problem, expected outcome, and any deadlines or compliance considerations."
          />
        </label>

        <div className="form-actions full-width">
          <button className="button primary" type="submit">
            Submit request
          </button>
          <p className="form-note">
            Submission creates a tracked request record and audit entry.
          </p>
        </div>
      </form>
    </section>
  );
}

