import { RequestFormValues } from '../types';

export type RequestFormErrors = Partial<Record<keyof RequestFormValues, string>>;

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function normalizeText(value: string) {
  return value.trim().replace(/\s+/g, ' ');
}

export function normalizeRequestFormValues(
  values: RequestFormValues,
): RequestFormValues {
  return {
    ...values,
    title: normalizeText(values.title),
    description: values.description.trim(),
    department: normalizeText(values.department),
    location: normalizeText(values.location),
    requesterName: normalizeText(values.requesterName),
    requesterEmail: values.requesterEmail.trim().toLowerCase(),
  };
}

export function validateRequestForm(
  values: RequestFormValues,
): RequestFormErrors {
  const errors: RequestFormErrors = {};

  if (!values.title) {
    errors.title = 'Enter a short request title.';
  } else if (values.title.length < 6) {
    errors.title = 'Use at least 6 characters so reviewers can scan the request quickly.';
  }

  if (!values.department) {
    errors.department = 'Enter the requesting department.';
  }

  if (!values.location) {
    errors.location = 'Enter the site or location for the request.';
  }

  if (!values.requesterName) {
    errors.requesterName = 'Enter the requester name.';
  }

  if (!values.requesterEmail) {
    errors.requesterEmail = 'Enter the requester email.';
  } else if (!emailPattern.test(values.requesterEmail)) {
    errors.requesterEmail = 'Enter a valid email address.';
  }

  if (!values.description) {
    errors.description = 'Describe the business problem and desired outcome.';
  } else if (values.description.length < 20) {
    errors.description =
      'Add a little more detail so the team can assess the request properly.';
  }

  return errors;
}
