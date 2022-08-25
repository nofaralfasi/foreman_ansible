import React from 'react';
import PropTypes from 'prop-types';
import { Formik, Field as FormikField } from 'formik';
import { useMutation } from '@apollo/client';
import { translate as __ } from 'foremanReact/common/I18n';

import {
  Modal,
  Button,
  ModalVariant,
  Spinner,
  Form as PfForm,
} from '@patternfly/react-core';
import {
  onSubmit,
  createValidationSchema,
  frequencyOpts,
  rangeValidator,
} from './NewRecurringJobHelper';

import {
  DatePickerField,
  TimePickerField,
  SelectField,
} from '../../../../formHelper';

import './NewRecurringJobModal.scss';

import { scheduledJobsSearch } from './JobsTabHelper';

import createJobInvocation from '../../../../graphql/mutations/createJobInvocation.gql';
import jobsQuery from '../../../../graphql/queries/recurringJobs.gql';

const NewRecurringJobModal = props => {
  const { onClose, resourceId, resourceName } = props;

  const [callMutation] = useMutation(createJobInvocation, {
    refetchQueries: [
      {
        query: jobsQuery,
        variables: { search: scheduledJobsSearch(resourceName, resourceId) },
      },
    ],
  });

  return (
    <Formik
      validationSchema={createValidationSchema()}
      onSubmit={onSubmit(callMutation, onClose, resourceName, resourceId)}
      initialValues={{
        startTime: '',
        startDate: '',
        repeat: '',
      }}
    >
      {formProps => {
        const actions = [
          <Button
            aria-label="submit creating job"
            ouiaId="submit-creating-job"
            key="confirm"
            variant="primary"
            onClick={formProps.handleSubmit}
            isDisabled={formProps.isSubmitting || !formProps.isValid}
          >
            {__('Submit')}
          </Button>,
          <Button
            aria-label="cancel creating job"
            ouiaId="cancel-creating-job"
            key="cancel"
            variant="link"
            onClick={onClose}
            isDisabled={formProps.isSubmitting}
          >
            {__('Cancel')}
          </Button>,
        ];

        if (formProps.isSubmitting) {
          actions.push(<Spinner key="spinner" size="lg" />);
        }

        return (
          <Modal
            variant={ModalVariant.large}
            title="Create New Recurring Ansible Run"
            ouiaId="modal-recurring-ansible-run"
            isOpen={props.isOpen}
            className="foreman-modal modal-high"
            showClose={false}
            actions={actions}
            disableFocusTrap
          >
            <PfForm>
              <FormikField
                name="repeat"
                component={SelectField}
                label="Repeat"
                isRequired
                selectItems={frequencyOpts}
              />
              <FormikField
                name="startTime"
                component={TimePickerField}
                label="Start Time"
                isRequired
                is24Hour
              />
              <FormikField
                name="startDate"
                component={DatePickerField}
                label="Start Date"
                isRequired
                validators={[rangeValidator]}
              />
            </PfForm>
          </Modal>
        );
      }}
    </Formik>
  );
};

NewRecurringJobModal.propTypes = {
  onClose: PropTypes.func.isRequired,
  resourceId: PropTypes.number.isRequired,
  resourceName: PropTypes.string.isRequired,
  isOpen: PropTypes.bool.isRequired,
};

export default NewRecurringJobModal;
