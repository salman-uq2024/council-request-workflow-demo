import { FormEvent, useState } from 'react';
import { requestCategories, requestPriorities } from '../data/requestOptions';
import {
  normalizeRequestFormValues,
  validateRequestForm,
} from '../data/requestValidation';
import { RequestCategory, RequestFormValues, RequestPriority } from '../types';

interface RequestFormProps {
  onSubmit: (values: RequestFormValues) => void;
}

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
  const [errors, setErrors] = useState<
    Partial<Record<keyof RequestFormValues, string>>
  >({});

  function updateField<Key extends keyof RequestFormValues>(
    key: Key,
    value: RequestFormValues[Key],
  ) {
    setValues((current) => ({ ...current, [key]: value }));
    setErrors((current) => {
      if (!current[key]) {
        return current;
      }

      const nextErrors = { ...current };
      delete nextErrors[key];
      return nextErrors;
    });
  }

  function handleFormSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const normalizedValues = normalizeRequestFormValues(values);
    const nextErrors = validateRequestForm(normalizedValues);

    setValues(normalizedValues);
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    onSubmit(normalizedValues);
    setValues(initialValues);
    setErrors({});
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
        {Object.keys(errors).length > 0 && (
          <div className="form-message form-message-error full-width" role="alert">
            Fix the highlighted fields before submitting the request.
          </div>
        )}

        <label>
          Request title
          <input
            required
            value={values.title}
            aria-invalid={Boolean(errors.title)}
            onChange={(event) => updateField('title', event.target.value)}
            placeholder="Example: Automate invoice reconciliation alerts"
          />
          {errors.title && <span className="field-error">{errors.title}</span>}
        </label>

        <label>
          Category
          <select
            value={values.category}
            onChange={(event) =>
              updateField('category', event.target.value as RequestCategory)
            }
          >
            {requestCategories.map((category) => (
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
            aria-invalid={Boolean(errors.department)}
            onChange={(event) => updateField('department', event.target.value)}
            placeholder="Example: Infrastructure and Environment"
          />
          {errors.department && (
            <span className="field-error">{errors.department}</span>
          )}
        </label>

        <label>
          Site / location
          <input
            required
            value={values.location}
            aria-invalid={Boolean(errors.location)}
            onChange={(event) => updateField('location', event.target.value)}
            placeholder="Example: Ipswich Civic Centre"
          />
          {errors.location && <span className="field-error">{errors.location}</span>}
        </label>

        <label>
          Priority
          <select
            value={values.priority}
            onChange={(event) =>
              updateField('priority', event.target.value as RequestPriority)
            }
          >
            {requestPriorities.map((priority) => (
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
            aria-invalid={Boolean(errors.requesterName)}
            onChange={(event) => updateField('requesterName', event.target.value)}
            placeholder="Example: Jordan Richards"
          />
          {errors.requesterName && (
            <span className="field-error">{errors.requesterName}</span>
          )}
        </label>

        <label>
          Requester email
          <input
            required
            type="email"
            value={values.requesterEmail}
            aria-invalid={Boolean(errors.requesterEmail)}
            onChange={(event) => updateField('requesterEmail', event.target.value)}
            placeholder="name@ipswich.demo"
          />
          {errors.requesterEmail && (
            <span className="field-error">{errors.requesterEmail}</span>
          )}
        </label>

        <label className="full-width">
          Business context and desired outcome
          <textarea
            required
            rows={5}
            value={values.description}
            aria-invalid={Boolean(errors.description)}
            onChange={(event) => updateField('description', event.target.value)}
            placeholder="Describe the current problem, expected outcome, and any deadlines or compliance considerations."
          />
          {errors.description && (
            <span className="field-error">{errors.description}</span>
          )}
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
